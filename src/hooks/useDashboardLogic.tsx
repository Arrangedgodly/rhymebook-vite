import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  getDoc,
  getFirestore,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import {
  RELATION_KEYS,
  fetchRelated,
  type RelatedWord,
  type RelationKey,
} from "../utils/rhymeApi";
import { getLastWord } from "../utils/lyrics";
import { getDefinition } from "../utils/dictionaryApi";
import {
  DEFAULT_RHYME_SETTINGS,
  coerceSettings,
  type RhymeSettings,
} from "../types/settings";
import type { DictionaryEntry } from "../utils/dictionaryApi";
import type { AppUser } from "../types/user";

export type Suggestions = Record<RelationKey, RelatedWord[]>;

function emptySuggestions(): Suggestions {
  const empty = {} as Suggestions;
  for (const key of RELATION_KEYS) empty[key] = [];
  return empty;
}

/** Shared empty value, so the derived fallback keeps a stable identity. */
const NO_SUGGESTIONS = emptySuggestions();

/** Wait this long after the last keystroke before hitting the API. */
const SUGGEST_DEBOUNCE_MS = 250;
const AUTOSAVE_DEBOUNCE_MS = 2000;

interface DashboardProps {
  currentUser: AppUser | null;
  existingNoteId?: string;
}

const useDashboardLogic = ({ currentUser, existingNoteId }: DashboardProps) => {
  const [title, setTitle] = useState<string>("");
  const [lyrics, setLyrics] = useState<string>("");
  const [themes, setThemes] = useState<string>("");
  const [isPinned, setIsPinned] = useState<boolean>(false);
  const [createdAt, setCreatedAt] = useState<Timestamp>();
  const [lastWord, setLastWord] = useState<string>("");
  const [suggestions, setSuggestions] = useState<Suggestions>(emptySuggestions);
  const [activeCategory, setActiveCategory] = useState<RelationKey>("rhyme");
  const [definition, setDefinition] = useState<DictionaryEntry | null>(null);
  const [definitionWord, setDefinitionWord] = useState<string>("");
  const [definitionState, setDefinitionState] = useState<
    "idle" | "loading" | "empty" | "error" | "ready"
  >("idle");
  const [noteId, setNoteId] = useState<string>(existingNoteId || "");
  const [settings, setSettings] = useState<RhymeSettings>(DEFAULT_RHYME_SETTINGS);

  /** The live textarea, so suggestions can be inserted at the caret. */
  const lyricsRef = useRef<HTMLTextAreaElement>(null);
  /** Where to put the caret after a programmatic insert. */
  const pendingCaret = useRef<number | null>(null);

  const db = getFirestore();

  /** A signed-out writer always gets the defaults, whatever was last loaded. */
  const activeSettings = useMemo(
    () => (currentUser ? settings : DEFAULT_RHYME_SETTINGS),
    [currentUser, settings]
  );

  const buildNote = useCallback(
    (uid: string) => ({
      userId: uid,
      title,
      lyrics,
      themes: themes || "",
      isPinned: isPinned || false,
      createdAt: createdAt || serverTimestamp(),
      lastEditedAt: serverTimestamp(),
    }),
    [title, lyrics, themes, isPinned, createdAt]
  );

  const handleSave = async () => {
    // The menu item only *looks* disabled when signed out, so guard for real.
    if (!currentUser) return;

    const notesCollection = collection(db, "notes");
    if (noteId) {
      await updateDoc(doc(notesCollection, noteId), buildNote(currentUser.uid));
    } else {
      const noteRef = await addDoc(notesCollection, buildNote(currentUser.uid));
      if (noteRef) setNoteId(noteRef.id);
    }
  };

  const clearDefinition = useCallback(() => {
    setDefinitionState("idle");
    setDefinition(null);
    setDefinitionWord("");
  }, []);

  /** Look a word up for the definition view. Long-press on touch, right-click on desktop. */
  const lookUpWord = useCallback(async (word: string) => {
    setDefinitionWord(word);
    setDefinition(null);
    setDefinitionState("loading");
    try {
      const entry = await getDefinition(word);
      if (entry) {
        setDefinition(entry);
        setDefinitionState("ready");
      } else {
        setDefinitionState("empty");
      }
    } catch {
      setDefinitionState("error");
    }
  }, []);

  const handleReset = useCallback(() => {
    setNoteId("");
    setTitle("");
    setLyrics("");
    setThemes("");
    setLastWord("");
    setSuggestions(emptySuggestions());
    clearDefinition();
  }, [clearDefinition]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== " " && e.key !== "Enter") return;
    // Read up to the caret: the word being finished is the one before it.
    const upToCaret = e.currentTarget.value.slice(
      0,
      e.currentTarget.selectionStart ?? e.currentTarget.value.length
    );
    setLastWord(getLastWord(upToCaret));
  };

  /**
   * Drop a suggested word in at the caret instead of tacking it onto the very
   * end, so picking a rhyme while editing line two doesn't append it to the
   * bottom of the song.
   */
  const handleLeftClick = (word: string) => {
    const el = lyricsRef.current;
    const start = el?.selectionStart ?? lyrics.length;
    const end = el?.selectionEnd ?? lyrics.length;

    const before = lyrics.slice(0, start);
    const after = lyrics.slice(end);
    const needsLeadingSpace = before.length > 0 && !/\s$/.test(before);
    const insertion = `${needsLeadingSpace ? " " : ""}${word}`;
    const needsTrailingSpace = after.length === 0 || !/^\s/.test(after);

    setLyrics(`${before}${insertion}${needsTrailingSpace ? " " : ""}${after}`);
    setLastWord(word);
    pendingCaret.current =
      before.length + insertion.length + (needsTrailingSpace ? 1 : 0);
  };

  // Restore the caret after an insert, then hand focus back to the writer.
  useEffect(() => {
    const caret = pendingCaret.current;
    const el = lyricsRef.current;
    if (caret === null || !el) return;
    pendingCaret.current = null;
    el.focus();
    el.setSelectionRange(caret, caret);
  }, [lyrics]);

  // Fetch every enabled section for the current word in one pass. The
  // AbortController means a fast typist's stale responses can never overwrite
  // the results for the word they're actually on.
  useEffect(() => {
    if (!lastWord) return;

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      const active = RELATION_KEYS.filter((key) => activeSettings.enabled[key]);
      const settled = await Promise.all(
        active.map(async (key) => {
          try {
            const words = await fetchRelated(key, lastWord, {
              themes,
              engine: activeSettings.engine,
              max: activeSettings.max,
              signal: controller.signal,
            });
            return [key, words] as const;
          } catch {
            // An aborted or failed section just stays empty.
            return [key, [] as RelatedWord[]] as const;
          }
        })
      );

      if (controller.signal.aborted) return;
      const next = emptySuggestions();
      for (const [key, words] of settled) next[key] = words;
      setSuggestions(next);
    }, SUGGEST_DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [lastWord, themes, activeSettings]);

  // Pull the signed-in user's suggestion preferences.
  useEffect(() => {
    if (!currentUser) return;
    let cancelled = false;
    (async () => {
      try {
        const snap = await getDoc(doc(db, "users", currentUser.uid));
        if (cancelled || !snap.exists()) return;
        setSettings(coerceSettings(snap.data().settings));
      } catch {
        // Preferences are a nicety; fall back to the defaults silently.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [currentUser, db]);

  // Load an existing note, or clear the form for a new one.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!existingNoteId) {
        handleReset();
        return;
      }
      const noteData = await getDoc(doc(db, "notes", existingNoteId));
      if (cancelled || !noteData.exists()) return;
      const note = noteData.data();
      setNoteId(existingNoteId);
      setTitle(note.title ?? "");
      setLyrics(note.lyrics ?? "");
      setThemes(note.themes ?? "");
      setIsPinned(note.isPinned ?? false);
      setCreatedAt(note.createdAt);
      setLastWord(getLastWord(note.lyrics ?? ""));
    })();
    return () => {
      cancelled = true;
    };
  }, [existingNoteId, db, handleReset]);

  // Autosave, but only for a note that already exists and a user who owns it.
  useEffect(() => {
    if (!noteId || !currentUser) return;
    const saveTimer = setTimeout(() => {
      updateDoc(
        doc(collection(db, "notes"), noteId),
        buildNote(currentUser.uid)
      ).catch(() => {
        // Leave the draft in the editor rather than interrupting the writer.
      });
    }, AUTOSAVE_DEBOUNCE_MS);
    return () => clearTimeout(saveTimer);
  }, [noteId, currentUser, buildNote, db]);

  return {
    title,
    setTitle,
    lyrics,
    setLyrics,
    themes,
    setThemes,
    suggestions: lastWord ? suggestions : NO_SUGGESTIONS,
    settings: activeSettings,
    lastWord,
    activeCategory,
    setActiveCategory,
    definition,
    definitionWord,
    definitionState,
    lookUpWord,
    clearDefinition,
    lyricsRef,
    handleSave,
    handleReset,
    handleLeftClick,
    handleKeyDown,
  };
};

export default useDashboardLogic;
