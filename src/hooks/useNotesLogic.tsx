import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getFirestore,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import {
  collectTags,
  fetchOwnNotes,
  fetchSharedNotes,
  normalizeTag,
  setNoteTags,
  shareNote,
  unshareNote,
} from "../utils/notesApi";
import { findUidByEmail, getProfile } from "../utils/profiles";
import type { Note } from "../types/note";
import type { AppUser } from "../types/user";
import type { PublicProfile } from "../types/profile";

export type NotesTab = "mine" | "shared";

export type ShareResult =
  | { ok: true; message: string }
  | { ok: false; message: string };

interface NotesProps {
  currentUser: AppUser | null;
}

const useNotesLogic = ({ currentUser }: NotesProps) => {
  const [ownNotes, setOwnNotes] = useState<Note[]>([]);
  const [sharedNotes, setSharedNotes] = useState<Note[]>([]);
  /** Whose notebook is currently in state; anything else means we are still loading. */
  const [loadedFor, setLoadedFor] = useState<string | null>(null);
  /** Who shared each of the shared notes, so they can be visited and followed. */
  const [owners, setOwners] = useState<Record<string, PublicProfile>>({});
  const [tab, setTab] = useState<NotesTab>("mine");
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const navigate = useNavigate();
  const db = getFirestore();

  const load = useCallback(async (uid: string) => {
    const [mine, shared] = await Promise.all([
      fetchOwnNotes(uid),
      fetchSharedNotes(uid),
    ]);
    return { mine, shared };
  }, []);

  useEffect(() => {
    if (!currentUser) {
      navigate("/");
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const { mine, shared } = await load(currentUser.uid);
        if (cancelled) return;
        setOwnNotes(mine);
        setSharedNotes(shared);

        const ownerIds = [...new Set(shared.map((n) => n.userId))];
        const profiles = await Promise.all(ownerIds.map((id) => getProfile(id)));
        if (cancelled) return;
        setOwners(
          Object.fromEntries(
            profiles
              .filter((p): p is PublicProfile => p !== null)
              .map((p) => [p.uid, p])
          )
        );
      } catch {
        // An unreadable notebook shows as empty rather than a broken page.
      } finally {
        if (!cancelled) setLoadedFor(currentUser.uid);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [currentUser, navigate, load]);

  const refresh = useCallback(async () => {
    if (!currentUser) return;
    const { mine, shared } = await load(currentUser.uid);
    setOwnNotes(mine);
    setSharedNotes(shared);
  }, [currentUser, load]);

  const loading = Boolean(currentUser) && loadedFor !== currentUser?.uid;

  const notes = tab === "mine" ? ownNotes : sharedNotes;
  const allTags = useMemo(() => collectTags(notes), [notes]);

  /** Pinned first, then whatever the tag filter allows. */
  const visibleNotes = useMemo(() => {
    const filtered = tagFilter
      ? notes.filter((n) => (n.tags ?? []).includes(tagFilter))
      : notes;
    return [...filtered].sort(
      (a, b) => Number(b.isPinned ?? false) - Number(a.isPinned ?? false)
    );
  }, [notes, tagFilter]);

  const createNote = useCallback(async () => {
    if (!currentUser) return;
    const ref = await addDoc(collection(db, "notes"), {
      title: "",
      lyrics: "",
      themes: "",
      tags: [],
      sharedWith: [],
      isPinned: false,
      userId: currentUser.uid,
      createdAt: serverTimestamp(),
      lastEditedAt: serverTimestamp(),
    });
    navigate(`/notes/${ref.id}`);
  }, [currentUser, db, navigate]);

  const togglePin = useCallback(
    async (noteId: string, isPinned: boolean) => {
      setOwnNotes((prev) =>
        prev.map((n) => (n.id === noteId ? { ...n, isPinned: !isPinned } : n))
      );
      await updateDoc(doc(db, "notes", noteId), { isPinned: !isPinned });
    },
    [db]
  );

  const deleteNote = useCallback(
    async (noteId: string) => {
      setOwnNotes((prev) => prev.filter((n) => n.id !== noteId));
      setSelectedNotes((prev) => prev.filter((id) => id !== noteId));
      await deleteDoc(doc(db, "notes", noteId));
    },
    [db]
  );

  const deleteNotes = useCallback(
    async (ids: string[]) => {
      if (ids.length === 0) return;
      setOwnNotes((prev) => prev.filter((n) => !ids.includes(n.id)));
      setSelectedNotes([]);
      const batch = writeBatch(db);
      ids.forEach((id) => batch.delete(doc(db, "notes", id)));
      await batch.commit();
    },
    [db]
  );

  const toggleSelected = useCallback((noteId: string) => {
    setSelectedNotes((prev) =>
      prev.includes(noteId)
        ? prev.filter((id) => id !== noteId)
        : [...prev, noteId]
    );
  }, []);

  const updateTags = useCallback(
    async (noteId: string, tags: string[]) => {
      const cleaned = [...new Set(tags.map(normalizeTag).filter(Boolean))];
      setOwnNotes((prev) =>
        prev.map((n) => (n.id === noteId ? { ...n, tags: cleaned } : n))
      );
      await setNoteTags(noteId, cleaned);
    },
    []
  );

  /** Resolve an email to an account, then add them to the note. */
  const shareWithEmail = useCallback(
    async (noteId: string, email: string): Promise<ShareResult> => {
      if (!currentUser) return { ok: false, message: "You are not signed in." };
      const address = email.trim();
      if (!address) return { ok: false, message: "Enter an email address." };

      try {
        const uid = await findUidByEmail(address);
        if (!uid) {
          return {
            ok: false,
            message: `No RhymePage account uses ${address}.`,
          };
        }
        if (uid === currentUser.uid) {
          return { ok: false, message: "That note is already yours." };
        }

        const note = ownNotes.find((n) => n.id === noteId);
        if (note?.sharedWith?.includes(uid)) {
          return { ok: false, message: "They already have this note." };
        }

        await shareNote(noteId, uid);
        setOwnNotes((prev) =>
          prev.map((n) =>
            n.id === noteId
              ? { ...n, sharedWith: [...(n.sharedWith ?? []), uid] }
              : n
          )
        );
        return { ok: true, message: `Shared with ${address}.` };
      } catch {
        return { ok: false, message: "Could not share it. Try again." };
      }
    },
    [currentUser, ownNotes]
  );

  const removeCollaborator = useCallback(
    async (noteId: string, uid: string) => {
      setOwnNotes((prev) =>
        prev.map((n) =>
          n.id === noteId
            ? { ...n, sharedWith: (n.sharedWith ?? []).filter((u) => u !== uid) }
            : n
        )
      );
      await unshareNote(noteId, uid);
    },
    []
  );

  return {
    ownNotes,
    sharedNotes,
    owners,
    visibleNotes,
    allTags,
    loading,
    tab,
    setTab,
    tagFilter,
    setTagFilter,
    selectedNotes,
    toggleSelected,
    createNote,
    togglePin,
    deleteNote,
    deleteNotes,
    updateTags,
    shareWithEmail,
    removeCollaborator,
    refresh,
  };
};

export default useNotesLogic;
