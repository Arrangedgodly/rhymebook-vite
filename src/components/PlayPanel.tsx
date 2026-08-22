import { useEffect, useRef, useState } from "react";
import usePlayLogic from "../hooks/usePlayLogic";
import type { LineTiming, SyncDoc } from "../types/sync";
import type { AppUser } from "../types/user";

interface PlayPanelProps {
  currentUser: AppUser | null;
  noteId: string;
}

type PlayMode = "simple" | "karaoke" | "teleprompter";
const MODES: { id: PlayMode; label: string }[] = [
  { id: "simple", label: "Simple" },
  { id: "karaoke", label: "Karaoke" },
  { id: "teleprompter", label: "Teleprompter" },
];

type GapBehavior = "hold" | "clear" | "preview";
const GAP_BEHAVIORS: { id: GapBehavior; label: string }[] = [
  { id: "hold", label: "Hold" },
  { id: "clear", label: "Clear" },
  { id: "preview", label: "Preview" },
];

/**
 * What to show during a gap between lines. `activeLineId` from `usePlayLogic`
 * stays a pure "literally playing right now, or null" signal -- this is a
 * presentation-only substitute, not a redefinition of "active". A full scan
 * rather than an early-break, since overlapping segments are intentionally
 * supported and can't be assumed chronological.
 */
function resolveGapLineId(
  behavior: GapBehavior,
  syncDoc: SyncDoc,
  currentTime: number
): string | null {
  if (behavior === "clear") return null;

  if (behavior === "hold") {
    let result: string | null = null;
    let resultEnd = -Infinity;
    for (const id of syncDoc.lineOrder) {
      const line = syncDoc.lines[id];
      if (line.end !== null && line.end <= currentTime && line.end > resultEnd) {
        result = id;
        resultEnd = line.end;
      }
    }
    return result;
  }

  let result: string | null = null;
  let resultStart = Infinity;
  for (const id of syncDoc.lineOrder) {
    const line = syncDoc.lines[id];
    if (line.start !== null && line.start > currentTime && line.start < resultStart) {
      result = id;
      resultStart = line.start;
    }
  }
  return result;
}

function formatTimestamp(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds - m * 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/** Word-by-word fill for the active line; falls back to a plain span for a word with no timing yet. */
const KaraokeLine = ({ line, currentTime }: { line: LineTiming; currentTime: number }) => (
  <>
    {line.words?.map((word, index) => {
      const sung = word.end !== null && currentTime >= word.end;
      const current =
        !sung && word.start !== null && word.end !== null && currentTime >= word.start;
      return (
        <span
          key={index}
          className={[
            "transition-opacity",
            sung ? "opacity-100" : current ? "opacity-100 text-primary" : "opacity-40",
          ].join(" ")}
        >
          {index > 0 ? " " : ""}
          {word.text}
        </span>
      );
    })}
  </>
);

/** Simple/karaoke/teleprompter presentation modes over the same synced-lyric data. */
const PlayPanel = ({ currentUser, noteId }: PlayPanelProps) => {
  const [mode, setMode] = useState<PlayMode>("simple");
  const [gapBehavior, setGapBehavior] = useState<GapBehavior>("hold");
  const [mirrored, setMirrored] = useState(false);
  const {
    syncDoc,
    loading,
    hasAudio,
    audioRef,
    isPlaying,
    currentTime,
    activeLineId,
    play,
    pause,
    seek,
    reset,
  } = usePlayLogic({ currentUser, noteId });

  const activeLineRef = useRef<HTMLParagraphElement>(null);

  // What to highlight right now: the truly active line, or -- during a gap --
  // whatever the gap-display choice substitutes in. Safe to compute before
  // the early returns below since it just short-circuits without `syncDoc`.
  const displayLineId =
    activeLineId ?? (syncDoc ? resolveGapLineId(gapBehavior, syncDoc, currentTime) : null);

  useEffect(() => {
    activeLineRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [displayLineId]);

  if (!noteId) {
    return (
      <div className="mx-auto max-w-md px-4 py-10 text-center text-sm opacity-70">
        Save this note first -- there's nothing to play yet.
      </div>
    );
  }

  if (loading) {
    return <div className="px-4 py-10 text-center text-sm opacity-60">Loading...</div>;
  }

  if (!syncDoc || syncDoc.lineOrder.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-10 text-center text-sm opacity-70">
        No synced lyrics yet -- head to the Sync tab to mark this song's timing.
      </div>
    );
  }

  const duration = syncDoc.audio?.durationSeconds ?? null;

  return (
    <div className="mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col gap-3 px-3 py-3 md:px-5">
      {hasAudio && syncDoc.audio && (
        <audio ref={audioRef} src={syncDoc.audio.downloadUrl} preload="metadata" />
      )}

      <div role="tablist" aria-label="Play mode" className="flex flex-none gap-1 border-b border-base-300">
        {MODES.map(({ id, label }) => (
          <button
            key={id}
            role="tab"
            type="button"
            aria-selected={mode === id}
            onClick={() => setMode(id)}
            className={[
              "-mb-px border-b-2 px-3 py-1.5 text-sm font-medium transition",
              mode === id
                ? "border-primary text-primary"
                : "border-transparent opacity-60 hover:opacity-100",
            ].join(" ")}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex flex-none flex-wrap items-center gap-3 text-xs">
        <div className="flex items-center gap-1">
          <span className="opacity-50">Gap</span>
          {GAP_BEHAVIORS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setGapBehavior(id)}
              className={[
                "rounded-full border px-2 py-0.5 transition",
                gapBehavior === id
                  ? "border-primary bg-primary text-primary-content"
                  : "border-base-300 opacity-70 hover:opacity-100",
              ].join(" ")}
            >
              {label}
            </button>
          ))}
        </div>
        {mode === "teleprompter" && (
          <button
            type="button"
            onClick={() => setMirrored((m) => !m)}
            className={[
              "rounded-full border px-2 py-0.5 transition",
              mirrored
                ? "border-primary bg-primary text-primary-content"
                : "border-base-300 opacity-70 hover:opacity-100",
            ].join(" ")}
          >
            Mirror
          </button>
        )}
      </div>

      <div
        className="no-bar flex min-h-0 flex-1 flex-col items-center justify-start gap-3 overflow-y-auto py-6 text-center"
        style={mirrored ? { transform: "scaleX(-1)" } : undefined}
      >
        {syncDoc.lineOrder.map((lineId) => {
          const line = syncDoc.lines[lineId];
          const isActive = lineId === activeLineId;
          const isDisplayed = lineId === displayLineId;
          const showKaraoke = mode === "karaoke" && isActive && (line.words?.length ?? 0) > 0;
          return (
            <p
              key={lineId}
              ref={isDisplayed ? activeLineRef : undefined}
              className={[
                "px-2 font-semibold leading-snug transition-opacity",
                mode === "teleprompter" ? "text-4xl md:text-5xl" : "text-2xl",
                isDisplayed ? "opacity-100" : "opacity-30",
              ].join(" ")}
            >
              {showKaraoke ? <KaraokeLine line={line} currentTime={currentTime} /> : line.text}
            </p>
          );
        })}
      </div>

      <div className="flex flex-none flex-col gap-2">
        {duration !== null && (
          <input
            type="range"
            min={0}
            max={duration}
            step={0.1}
            value={Math.min(currentTime, duration)}
            onChange={(e) => seek(Number(e.target.value))}
            className="range range-primary range-xs w-full"
            aria-label="Playback position"
          />
        )}
        <div className="flex items-center justify-center gap-3">
          <span className="w-12 flex-none text-right text-xs tabular-nums opacity-60">
            {formatTimestamp(currentTime)}
          </span>
          <button type="button" className="btn btn-ghost btn-sm" onClick={reset}>
            Reset
          </button>
          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={() => (isPlaying ? pause() : play())}
          >
            {isPlaying ? "Pause" : "Play"}
          </button>
          {duration !== null && (
            <span className="w-12 flex-none text-xs tabular-nums opacity-60">
              {formatTimestamp(duration)}
            </span>
          )}
        </div>
        {!hasAudio && (
          <p className="text-center text-xs opacity-50">
            No audio attached -- playing from the synced timing alone.
          </p>
        )}
      </div>
    </div>
  );
};

export default PlayPanel;
