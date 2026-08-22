import { useEffect, useRef, useState, type RefObject } from "react";
import { splitWords } from "../utils/lyrics";
import type { LineTiming, WordTiming } from "../types/sync";

interface WordSyncEditorProps {
  /** `line.start`/`line.end` are guaranteed non-null by the caller -- word sync needs a bounded window. */
  line: LineTiming;
  audioRef: RefObject<HTMLAudioElement | null>;
  onWordsChange: (lineId: string, words: WordTiming[]) => void;
  onClose: () => void;
}

/** Words are far shorter than lines, so Replay only needs a small rewind. */
const WORD_REPLAY_SECONDS = 1.5;

function formatSeconds(seconds: number | null): string {
  return seconds === null ? "--" : seconds.toFixed(2);
}

/** Reuses existing word timing if it's still valid for the current text, rather than discarding it. */
function seedWords(line: LineTiming): WordTiming[] {
  const texts = splitWords(line.text);
  const existing = line.words;
  const reusable =
    !!existing &&
    existing.length === texts.length &&
    existing.every((w, i) => w.text === texts[i]);
  if (reusable && existing) return existing.map((w) => ({ ...w }));
  return texts.map((text) => ({ text, start: null, end: null }));
}

/**
 * A tap-through mini fast-sync for one line's words, mirroring useSyncLogic's
 * mark/replay/undo vocabulary but bounded to the line's own audio window.
 * Reuses the same shared `<audio>` element via `audioRef` rather than a
 * second one.
 */
const WordSyncEditor = ({ line, audioRef, onWordsChange, onClose }: WordSyncEditorProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [words, setWords] = useState<WordTiming[]>(() => seedWords(line));
  const [armedIndex, setArmedIndex] = useState<number | null>(() => {
    const idx = words.findIndex((w) => w.start === null);
    return idx === -1 ? null : idx;
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [canUndo, setCanUndo] = useState(false);

  const undoStackRef = useRef<
    { index: number; previousStart: number | null; previousEnd: number | null }[]
  >([]);
  /** The word marked most recently, so the next mark can close its `end`. */
  const previouslyArmedRef = useRef<number | null>(null);

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  // Bound playback to this line's window and start at its beginning.
  useEffect(() => {
    const audioEl = audioRef.current;
    if (!audioEl || line.start === null || line.end === null) return;
    const lineStart = line.start;
    const lineEnd = line.end;
    audioEl.currentTime = lineStart;

    const onTimeUpdate = () => {
      if (audioEl.currentTime >= lineEnd) audioEl.pause();
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    audioEl.addEventListener("timeupdate", onTimeUpdate);
    audioEl.addEventListener("play", onPlay);
    audioEl.addEventListener("pause", onPause);
    return () => {
      audioEl.removeEventListener("timeupdate", onTimeUpdate);
      audioEl.removeEventListener("play", onPlay);
      audioEl.removeEventListener("pause", onPause);
    };
  }, [audioRef, line.start, line.end]);

  const commit = (next: WordTiming[]) => {
    setWords(next);
    onWordsChange(line.lineId, next);
  };

  const mark = () => {
    const audioEl = audioRef.current;
    if (!audioEl || armedIndex === null || line.end === null) return;
    const timestamp = audioEl.currentTime;
    const next = [...words];

    undoStackRef.current.push({
      index: armedIndex,
      previousStart: next[armedIndex].start,
      previousEnd: next[armedIndex].end,
    });
    setCanUndo(true);

    const prevIndex = previouslyArmedRef.current;
    if (prevIndex !== null && prevIndex !== armedIndex && next[prevIndex].end === null) {
      next[prevIndex] = { ...next[prevIndex], end: timestamp };
    }

    // The last word is bounded by the parent line's own end -- no separate
    // "Finish" tap needed, unlike line-level sync which has no such bound.
    const isLast = armedIndex === next.length - 1;
    next[armedIndex] = {
      ...next[armedIndex],
      start: timestamp,
      end: isLast ? line.end : next[armedIndex].end,
    };

    commit(next);
    previouslyArmedRef.current = armedIndex;
    setArmedIndex(isLast ? null : armedIndex + 1);
  };

  const replay = () => {
    const audioEl = audioRef.current;
    if (!audioEl || line.start === null) return;
    audioEl.currentTime = Math.max(line.start, audioEl.currentTime - WORD_REPLAY_SECONDS);
  };

  const undo = () => {
    const last = undoStackRef.current.pop();
    setCanUndo(undoStackRef.current.length > 0);
    if (!last) return;
    const next = [...words];
    next[last.index] = { ...next[last.index], start: last.previousStart, end: last.previousEnd };
    commit(next);
    setArmedIndex(last.index);
    previouslyArmedRef.current = null;
  };

  const resumeFrom = (index: number) => {
    previouslyArmedRef.current = null;
    setArmedIndex(index);
  };

  const togglePlay = () => {
    const audioEl = audioRef.current;
    if (!audioEl) return;
    if (isPlaying) audioEl.pause();
    else void audioEl.play();
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="m-auto w-[min(28rem,calc(100vw-2rem))] rounded-lg border border-base-300
                 bg-base-100 p-0 text-base-content backdrop:bg-black/40"
    >
      <div className="flex flex-col gap-3 px-5 py-4">
        <h2 className="text-base font-semibold">Word timing</h2>
        <p className="text-sm opacity-70">{line.text}</p>

        <div className="no-bar flex max-h-64 flex-col gap-1 overflow-y-auto rounded-md border border-base-300 px-2 py-2">
          {words.map((word, index) => {
            const isArmed = index === armedIndex;
            const isTimed = word.start !== null && word.end !== null;
            return (
              <button
                key={index}
                type="button"
                onClick={() => resumeFrom(index)}
                className={[
                  "flex items-center justify-between gap-2 rounded px-2 py-1 text-left text-sm transition",
                  isArmed
                    ? "bg-primary text-primary-content"
                    : isTimed
                      ? "opacity-70 hover:opacity-100"
                      : "opacity-90",
                ].join(" ")}
              >
                <span>{word.text}</span>
                <span className="tabular-nums text-xs opacity-70">
                  {formatSeconds(word.start)} - {formatSeconds(word.end)}
                </span>
              </button>
            );
          })}
        </div>

        <p className="text-center text-xs opacity-50">
          {armedIndex !== null
            ? `Marking word ${armedIndex + 1} of ${words.length}`
            : "All words marked."}
        </p>

        <div className="flex items-center justify-center gap-2">
          <button type="button" className="btn btn-ghost btn-sm" disabled={!canUndo} onClick={undo}>
            Undo
          </button>
          <button type="button" className="btn btn-outline btn-sm" onClick={replay}>
            Replay
          </button>
          <button
            type="button"
            className="btn btn-primary btn-lg"
            disabled={armedIndex === null}
            onClick={mark}
          >
            Mark
          </button>
          <button type="button" className="btn btn-outline btn-sm" onClick={togglePlay}>
            {isPlaying ? "Pause" : "Play"}
          </button>
        </div>
      </div>

      <div className="flex justify-end border-t border-base-300 px-5 py-3">
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() => dialogRef.current?.close()}
        >
          Done
        </button>
      </div>
    </dialog>
  );
};

export default WordSyncEditor;
