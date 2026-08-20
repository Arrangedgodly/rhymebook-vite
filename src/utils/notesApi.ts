import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import type { Note } from "../types/note";

function toNote(id: string, data: Record<string, unknown>): Note {
  return { ...(data as Omit<Note, "id">), id };
}

/** Notes this user owns, most recently edited first. */
export async function fetchOwnNotes(uid: string): Promise<Note[]> {
  const snap = await getDocs(
    query(
      collection(getFirestore(), "notes"),
      where("userId", "==", uid),
      orderBy("lastEditedAt", "desc")
    )
  );
  return snap.docs.map((d) => toNote(d.id, d.data()));
}

/**
 * Notes other people have shared with this user.
 *
 * Deliberately not ordered in the query: combining `array-contains` with an
 * `orderBy` on a different field needs a composite index, and sorting a
 * personal-sized list in memory is cheaper than making the app depend on one.
 */
export async function fetchSharedNotes(uid: string): Promise<Note[]> {
  const snap = await getDocs(
    query(
      collection(getFirestore(), "notes"),
      where("sharedWith", "array-contains", uid)
    )
  );
  return snap.docs
    .map((d) => toNote(d.id, d.data()))
    .sort((a, b) => {
      const at = (a.lastEditedAt as { seconds?: number })?.seconds ?? 0;
      const bt = (b.lastEditedAt as { seconds?: number })?.seconds ?? 0;
      return bt - at;
    });
}

export async function shareNote(noteId: string, uid: string): Promise<void> {
  await updateDoc(doc(getFirestore(), "notes", noteId), {
    sharedWith: arrayUnion(uid),
  });
}

export async function unshareNote(noteId: string, uid: string): Promise<void> {
  await updateDoc(doc(getFirestore(), "notes", noteId), {
    sharedWith: arrayRemove(uid),
  });
}

export async function setNoteTags(
  noteId: string,
  tags: string[]
): Promise<void> {
  await updateDoc(doc(getFirestore(), "notes", noteId), { tags });
}

/** Every distinct tag across a set of notes, alphabetical. */
export function collectTags(notes: Note[]): string[] {
  const seen = new Set<string>();
  for (const note of notes) for (const tag of note.tags ?? []) seen.add(tag);
  return [...seen].sort((a, b) => a.localeCompare(b));
}

/** Tags are matched case-insensitively and stored trimmed. */
export function normalizeTag(raw: string): string {
  return raw.trim().replace(/\s+/g, " ").toLowerCase();
}

/** Used when deleting an account: remove everything the user owns. */
export async function deleteNotesOwnedBy(uid: string): Promise<number> {
  const db = getFirestore();
  const snap = await getDocs(
    query(collection(db, "notes"), where("userId", "==", uid))
  );
  if (snap.empty) return 0;

  // Firestore caps a batch at 500 writes.
  let removed = 0;
  for (let i = 0; i < snap.docs.length; i += 450) {
    const batch = writeBatch(db);
    for (const d of snap.docs.slice(i, i + 450)) batch.delete(d.ref);
    await batch.commit();
    removed += Math.min(450, snap.docs.length - i);
  }
  return removed;
}
