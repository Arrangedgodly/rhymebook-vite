import { useCallback, useEffect, useRef, useState } from "react";
import {
  attachAudio as attachAudioFile,
  discardOrphanedLine,
  ensureSyncDoc,
  getSyncDoc,
  reconcileSync,
  recordLineTiming,
  recordLineTimings,
  removeAudio as removeAudioFile,
} from "../utils/syncApi";
import { computeSyncStatus } from "../types/sync";
import type { LineTiming, SyncDoc, SyncStatus, WordTiming } from "../types/sync";
import type { AppUser } from "../types/user";

/** How far Replay rewinds so a missed line is cheap to retry. */
const REPLAY_SECONDS = 3;

interface UndoEntry {
  lineId: string;
  previousStart: number | null;
  previousEnd: number | null;
}

function firstUntimedLineId(doc: SyncDoc): string | null {
  return (
    doc.lineOrder.find((lineId) => doc.lines[lineId]?.start === null) ?? null
  );
}

/** Applies patches to a local copy of the doc for an optimistic UI update. */
function applyPatches(
  doc: SyncDoc,
  patches: { lineId: string; patch: Partial<Omit<LineTiming, "lineId">> }[]
): SyncDoc {
  const lines = { ...doc.lines };
  for (const { lineId, patch } of patches) {
    const existing = lines[lineId];
    if (!existing) continue;
    lines[lineId] = { ...existing, ...patch };
  }
  return { ...doc, lines };
}

interface UseSyncLogicProps {
  currentUser: AppUser | null;
  /** A note must already be saved (have an id) before it can be synced. */
  noteId: string;
  /** The live lyrics from the Write tab -- reconciliation compares against this, not a refetch. */
  lyrics: string;
}

const useSyncLogic = ({ currentUser, noteId, lyrics }: UseSyncLogicProps) => {
  const [syncDoc, setSyncDoc] = useState<SyncDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [armedLineId, setArmedLineId] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [uploading, setUploading] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  /** `performance.now()` when the local (audio-less) clock last started running. */
  const clockStartRef = useRef<number | null>(null);
  /** Seconds accumulated on the local clock while it was last paused. */
  const clockElapsedRef = useRef(0);
  const undoStackRef = useRef<UndoEntry[]>([]);
  /** The line marked most recently, so the next mark can close its `end`. */
  const previouslyArmedRef = useRef<string | null>(null);
  const [undoCount, setUndoCount] = useState(0);

  const uid = currentUser?.uid ?? null;
  const hasAudio = Boolean(syncDoc?.audio);

  const pushUndo = useCallback((entry: UndoEntry) => {
    undoStackRef.current.push(entry);
    setUndoCount(undoStackRef.current.length);
  }, []);

  const popUndo = useCallback((): UndoEntry | undefined => {
    const entry = undoStackRef.current.pop();
    setUndoCount(undoStackRef.current.length);
    return entry;
  }, []);

  // Bootstrap: load the existing sync doc, or create one seeded from lyrics.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!noteId || !uid) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const doc = await ensureSyncDoc(noteId, uid, lyrics);
        if (cancelled) return;
        setSyncDoc(doc);
        setArmedLineId(firstUntimedLineId(doc));
      } catch {
        if (!cancelled) setError("Couldn't load sync data for this song.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // Deliberately not keyed on `lyrics`: this effect only bootstraps the
    // doc. Drift after that is handled by the reconciliation effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noteId, uid]);

  // Detect lyric drift since the last reconciliation and repair timing.
  useEffect(() => {
    if (!syncDoc || !noteId || syncDoc.lyricsSnapshot === lyrics) return;
    let cancelled = false;
    (async () => {
      try {
        const reconciled = await reconcileSync(noteId, lyrics);
        if (cancelled) return;
        setSyncDoc(reconciled);
        setArmedLineId((current) => {
          const stillValid =
            current &&
            reconciled.lines[current] &&
            !reconciled.lines[current].needsReview;
          return stillValid ? current : firstUntimedLineId(reconciled);
        });
      } catch {
        // Leave the stale sync in place -- the drift banner in the UI keeps
        // reflecting `lyrics !== syncDoc.lyricsSnapshot` until this retries.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [lyrics, syncDoc, noteId]);

  const getElapsedSeconds = useCallback((): number => {
    if (audioRef.current && hasAudio) return audioRef.current.currentTime;
    if (clockStartRef.current === null) return clockElapsedRef.current;
    return (
      clockElapsedRef.current + (performance.now() - clockStartRef.current) / 1000
    );
  }, [hasAudio]);

  const start = useCallback(() => {
    if (audioRef.current && hasAudio) {
      audioRef.current.play();
    } else {
      clockStartRef.current = performance.now();
    }
    setIsRunning(true);
  }, [hasAudio]);

  const pause = useCallback(() => {
    if (audioRef.current && hasAudio) {
      audioRef.current.pause();
    } else if (clockStartRef.current !== null) {
      clockElapsedRef.current +=
        (performance.now() - clockStartRef.current) / 1000;
      clockStartRef.current = null;
    }
    setIsRunning(false);
  }, [hasAudio]);

  const replay = useCallback(() => {
    if (audioRef.current && hasAudio) {
      audioRef.current.currentTime = Math.max(
        0,
        audioRef.current.currentTime - REPLAY_SECONDS
      );
      return;
    }
    clockElapsedRef.current = Math.max(0, getElapsedSeconds() - REPLAY_SECONDS);
    if (clockStartRef.current !== null) clockStartRef.current = performance.now();
  }, [hasAudio, getElapsedSeconds]);

  /** Tap/click/key: captures the armed line's start and advances to the next line. */
  const mark = useCallback(async () => {
    if (!noteId || !syncDoc || !armedLineId) return;
    const timestamp = getElapsedSeconds();
    const armedLine = syncDoc.lines[armedLineId];

    pushUndo({
      lineId: armedLineId,
      previousStart: armedLine?.start ?? null,
      previousEnd: armedLine?.end ?? null,
    });

    const patches: { lineId: string; patch: Partial<Omit<LineTiming, "lineId">> }[] =
      [{ lineId: armedLineId, patch: { start: timestamp, source: "fast-sync" } }];

    // The initial end of the previous line is inferred as this line's start
    // (spec: "Start and End Times") -- the precision editor can adjust it later.
    const prevId = previouslyArmedRef.current;
    if (prevId && prevId !== armedLineId) {
      const prevLine = syncDoc.lines[prevId];
      if (prevLine && prevLine.end === null) {
        patches.push({ lineId: prevId, patch: { end: timestamp } });
      }
    }

    setSyncDoc((current) => (current ? applyPatches(current, patches) : current));
    recordLineTimings(noteId, patches).catch(() => {
      // Leave the optimistic UI state; the writer can retry the mark or fix
      // it in the precision editor later rather than losing their place.
    });

    previouslyArmedRef.current = armedLineId;
    const idx = syncDoc.lineOrder.indexOf(armedLineId);
    const nextLineId = syncDoc.lineOrder[idx + 1] ?? null;
    setArmedLineId(nextLineId);
    if (!nextLineId) pause();
  }, [noteId, syncDoc, armedLineId, getElapsedSeconds, pause, pushUndo]);

  /** Closes the final marked line's end. Needed because there's no next line to imply it. */
  const finish = useCallback(async () => {
    if (!noteId || !syncDoc) return;
    const lastId = previouslyArmedRef.current;
    if (!lastId) return;
    const line = syncDoc.lines[lastId];
    if (!line || line.end !== null) return;

    const timestamp = getElapsedSeconds();
    pushUndo({
      lineId: lastId,
      previousStart: line.start,
      previousEnd: line.end,
    });
    const patch = { lineId: lastId, patch: { end: timestamp } };
    setSyncDoc((current) => (current ? applyPatches(current, [patch]) : current));
    await recordLineTiming(noteId, lastId, patch.patch);
    pause();
  }, [noteId, syncDoc, getElapsedSeconds, pause, pushUndo]);

  const undo = useCallback(async () => {
    if (!noteId) return;
    const last = popUndo();
    if (!last) return;
    const patch = { start: last.previousStart, end: last.previousEnd };
    setSyncDoc((current) =>
      current ? applyPatches(current, [{ lineId: last.lineId, patch }]) : current
    );
    setArmedLineId(last.lineId);
    // Conservative: don't guess which line was armed before the undone mark.
    previouslyArmedRef.current = null;
    await recordLineTiming(noteId, last.lineId, patch);
  }, [noteId, popUndo]);

  /** Re-entrant sync: select any already-synced line and resume marking from there. */
  const resumeFrom = useCallback((lineId: string) => {
    previouslyArmedRef.current = null;
    setArmedLineId(lineId);
  }, []);

  const discardOrphan = useCallback(
    async (lineId: string) => {
      if (!noteId) return;
      await discardOrphanedLine(noteId, lineId);
      setSyncDoc((current) => {
        if (!current) return current;
        const rest: Record<string, LineTiming> = {};
        for (const [id, line] of Object.entries(current.lines)) {
          if (id !== lineId) rest[id] = line;
        }
        const stillHasOrphans = Object.values(rest).some(
          (l) => l.needsReview && !current.lineOrder.includes(l.lineId)
        );
        return { ...current, lines: rest, needsReview: stillHasOrphans };
      });
    },
    [noteId]
  );

  const attachAudio = useCallback(
    async (file: File) => {
      if (!noteId || !uid) return;
      setUploading(true);
      try {
        await attachAudioFile(noteId, uid, file);
        const fresh = await getSyncDoc(noteId);
        if (fresh) setSyncDoc(fresh);
      } finally {
        setUploading(false);
      }
    },
    [noteId, uid]
  );

  const removeAudio = useCallback(async () => {
    if (!noteId) return;
    await removeAudioFile(noteId);
    setSyncDoc((current) => (current ? { ...current, audio: undefined } : current));
  }, [noteId]);

  /** Precision editor: a drag/resize on a waveform region, written on drag-end. */
  const setLineTiming = useCallback(
    async (lineId: string, start: number, end: number) => {
      if (!noteId) return;
      const patch = { start, end, source: "waveform" as const };
      setSyncDoc((current) =>
        current ? applyPatches(current, [{ lineId, patch }]) : current
      );
      await recordLineTiming(noteId, lineId, patch);
    },
    [noteId]
  );

  /** Word-level sync: the whole words array is rewritten on each mark/undo -- a line's word count is small. */
  const setLineWords = useCallback(
    async (lineId: string, words: WordTiming[]) => {
      if (!noteId) return;
      setSyncDoc((current) =>
        current ? applyPatches(current, [{ lineId, patch: { words } }]) : current
      );
      await recordLineTiming(noteId, lineId, { words });
    },
    [noteId]
  );

  const status: SyncStatus = syncDoc ? computeSyncStatus(syncDoc) : "draft";
  const reviewLines = syncDoc
    ? Object.values(syncDoc.lines).filter(
        (l) => l.needsReview && !syncDoc.lineOrder.includes(l.lineId)
      )
    : [];

  return {
    syncDoc,
    loading,
    error,
    status,
    reviewLines,
    armedLineId,
    isRunning,
    uploading,
    hasAudio,
    audioRef,
    start,
    pause,
    replay,
    mark,
    finish,
    undo,
    setLineTiming,
    setLineWords,
    resumeFrom,
    discardOrphan,
    attachAudio,
    removeAudio,
    canUndo: undoCount > 0,
  };
};

export default useSyncLogic;
