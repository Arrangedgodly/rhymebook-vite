import { useEffect, useRef, useState } from "react";
import useSyncLogic from "../hooks/useSyncLogic";
import WaveformEditor from "./WaveformEditor";
import WordSyncEditor from "./WordSyncEditor";
import { FormMessage } from "./FormControls";
import ConfirmDialog from "./ConfirmDialog";
import { downloadTextFile, slugForFilename, toExportJson, toLrc } from "../utils/syncExport";
import type { AppUser } from "../types/user";

interface SyncPanelProps {
  currentUser: AppUser | null;
  noteId: string;
  lyrics: string;
  title: string;
}

type SyncView = "fast" | "precision";

function formatTimestamp(seconds: number | null): string {
  if (seconds === null) return "--:--";
  const m = Math.floor(seconds / 60);
  const s = seconds - m * 60;
  return `${m}:${s.toFixed(2).padStart(5, "0")}`;
}

const SyncPanel = ({ currentUser, noteId, lyrics, title }: SyncPanelProps) => {
  const [confirmingRemoveAudio, setConfirmingRemoveAudio] = useState(false);
  const [requestedView, setRequestedView] = useState<SyncView>("fast");
  const [wordSyncLineId, setWordSyncLineId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
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
    resumeFrom,
    discardOrphan,
    attachAudio,
    removeAudio,
    setLineTiming,
    setLineWords,
    canUndo,
  } = useSyncLogic({ currentUser, noteId, lyrics });

  // The precision editor needs audio to draw a waveform against -- fall back
  // to fast-sync if it was removed while that view was open, without a
  // dedicated effect (this is a pure derivation, not new state to persist).
  const view: SyncView = hasAudio ? requestedView : "fast";

  // Whether a line has been started but not yet closed -- at most one line is
  // ever in this state at a time, so this is a reliable "still needs Finish"
  // signal without the panel having to track which line was marked last.
  // Null-safe since syncDoc may still be loading here, before this hook's
  // effect (which needs it as a dependency) but after the early guards below.
  const needsFinish =
    syncDoc?.lineOrder.some((id) => {
      const line = syncDoc.lines[id];
      return line.start !== null && line.end === null;
    }) ?? false;

  // Space to mark, "r" to replay, desktop-only convenience -- avoids
  // hijacking typing in the (only) text input on this panel, the file picker.
  // Suppressed while the word-sync modal is open: its own controls own Space
  // /keyboard focus there, and a native <dialog> doesn't stop this bubbling.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (wordSyncLineId) return;
      const target = e.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA"].includes(target.tagName)) return;
      if (e.code === "Space") {
        e.preventDefault();
        if (armedLineId) void mark();
        else if (needsFinish) void finish();
      } else if (e.key.toLowerCase() === "r") {
        replay();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [armedLineId, mark, finish, replay, wordSyncLineId, needsFinish]);

  if (!currentUser) {
    return (
      <div className="mx-auto max-w-md px-4 py-10 text-center text-sm opacity-70">
        Log in to sync this song to a recording.
      </div>
    );
  }

  if (!noteId) {
    return (
      <div className="mx-auto max-w-md px-4 py-10 text-center text-sm opacity-70">
        Save this note first -- sync needs somewhere to keep its timing.
      </div>
    );
  }

  if (loading) {
    return <div className="px-4 py-10 text-center text-sm opacity-60">Loading sync...</div>;
  }

  if (error || !syncDoc) {
    return (
      <div className="mx-auto max-w-md px-4 py-10">
        <FormMessage tone="error">{error ?? "Couldn't load sync data."}</FormMessage>
      </div>
    );
  }

  const armedIndex = armedLineId ? syncDoc.lineOrder.indexOf(armedLineId) : -1;
  const hasTimedLines = syncDoc.lineOrder.some((id) => syncDoc.lines[id].start !== null);

  return (
    <div className="mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col gap-3 px-3 py-3 md:px-5">
      <div className="flex flex-none items-center justify-between gap-2">
        <span
          className={[
            "rounded-full px-2.5 py-1 text-xs font-medium",
            status === "complete"
              ? "bg-success/15 text-success"
              : "bg-warning/15 text-warning",
          ].join(" ")}
        >
          {status === "complete" ? "Complete" : "Draft"}
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="btn btn-ghost btn-xs"
            disabled={!hasTimedLines}
            title={hasTimedLines ? undefined : "Mark at least one line before exporting"}
            onClick={() => {
              const slug = slugForFilename(title);
              downloadTextFile(`${slug}.lrc`, toLrc(syncDoc, title), "text/plain");
            }}
          >
            Export LRC
          </button>
          <button
            type="button"
            className="btn btn-ghost btn-xs"
            disabled={!hasTimedLines}
            title={hasTimedLines ? undefined : "Mark at least one line before exporting"}
            onClick={() => {
              const slug = slugForFilename(title);
              downloadTextFile(
                `${slug}.json`,
                JSON.stringify(toExportJson(syncDoc, title), null, 2),
                "application/json"
              );
            }}
          >
            Export JSON
          </button>
          <button
            type="button"
            className="btn btn-outline btn-xs"
            disabled={!hasAudio}
            title={hasAudio ? undefined : "Attach audio to use the precision editor"}
            onClick={() => setRequestedView(view === "fast" ? "precision" : "fast")}
          >
            {view === "fast" ? "Precision editor" : "Fast sync"}
          </button>
          {hasAudio ? (
            <button
              type="button"
              className="btn btn-ghost btn-xs"
              onClick={() => setConfirmingRemoveAudio(true)}
            >
              Remove audio
            </button>
          ) : null}
          <button
            type="button"
            className="btn btn-outline btn-xs"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
          >
            {uploading ? "Uploading..." : hasAudio ? "Replace audio" : "Attach audio"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (file) void attachAudio(file);
            }}
          />
        </div>
      </div>

      {hasAudio && syncDoc.audio && (
        <audio ref={audioRef} src={syncDoc.audio.downloadUrl} preload="metadata" />
      )}

      {syncDoc.warnings.length > 0 && (
        <div className="flex flex-none flex-col gap-1 rounded-md border border-warning/40 bg-warning/10 px-3 py-2">
          {syncDoc.warnings.map((w, i) => (
            <p key={i} className="text-xs text-warning">
              {w.message}
            </p>
          ))}
        </div>
      )}

      {reviewLines.length > 0 && (
        <div className="flex flex-none flex-col gap-1.5 rounded-md border border-warning/40 bg-warning/10 px-3 py-2">
          <p className="text-xs font-medium text-warning">
            {reviewLines.length} old line{reviewLines.length === 1 ? "" : "s"} no longer
            match the lyrics and need review:
          </p>
          {reviewLines.map((line) => (
            <div key={line.lineId} className="flex items-center justify-between gap-2">
              <span className="truncate text-xs opacity-70 line-through">{line.text}</span>
              <button
                type="button"
                className="btn btn-ghost btn-xs flex-none"
                onClick={() => void discardOrphan(line.lineId)}
              >
                Discard
              </button>
            </div>
          ))}
        </div>
      )}

      {view === "precision" ? (
        <WaveformEditor
          syncDoc={syncDoc}
          audioRef={audioRef}
          onLineTimingChange={setLineTiming}
        />
      ) : (
        <>
          {/* Tap-anywhere marking surface, plus the scrollable line list. */}
          <div
            role="button"
            tabIndex={-1}
            onClick={() => {
              if (armedLineId) void mark();
              else if (needsFinish) void finish();
            }}
            className="no-bar flex min-h-0 flex-1 cursor-pointer flex-col gap-1 overflow-y-auto rounded-md
                       border border-base-300 px-3 py-2"
          >
            {syncDoc.lineOrder.map((lineId) => {
              const line = syncDoc.lines[lineId];
              const isArmed = lineId === armedLineId;
              const isTimed = line.start !== null && line.end !== null;
              const hasWords = (line.words?.length ?? 0) > 0;
              return (
                <div
                  key={lineId}
                  className={[
                    "flex items-center gap-1 rounded transition",
                    isArmed ? "bg-primary text-primary-content" : "",
                  ].join(" ")}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      resumeFrom(lineId);
                    }}
                    className={[
                      "flex min-w-0 flex-1 items-center justify-between gap-2 px-2 py-1.5 text-left text-sm",
                      !isArmed && (isTimed ? "opacity-70 hover:opacity-100" : "opacity-90"),
                    ].join(" ")}
                  >
                    <span className="min-w-0 flex-1 truncate">
                      {line.text}
                      {hasWords && <span className="ml-1.5 opacity-60">&bull;</span>}
                    </span>
                    <span className="flex-none tabular-nums text-xs opacity-70">
                      {formatTimestamp(line.start)} - {formatTimestamp(line.end)}
                    </span>
                  </button>
                  {isTimed && (
                    <button
                      type="button"
                      title="Word timing"
                      onClick={(e) => {
                        e.stopPropagation();
                        setWordSyncLineId(lineId);
                      }}
                      className={[
                        "btn btn-ghost btn-xs flex-none",
                        isArmed ? "text-primary-content" : "",
                      ].join(" ")}
                    >
                      Words
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex flex-none items-center justify-center gap-2">
            <button type="button" className="btn btn-ghost btn-sm" disabled={!canUndo} onClick={() => void undo()}>
              Undo
            </button>
            <button type="button" className="btn btn-outline btn-sm" onClick={replay}>
              Replay
            </button>
            <button
              type="button"
              className="btn btn-primary btn-lg"
              disabled={!armedLineId && !needsFinish}
              onClick={() => (armedLineId ? void mark() : void finish())}
            >
              {armedLineId ? "Mark" : needsFinish ? "Finish" : "Done"}
            </button>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => (isRunning ? pause() : start())}
            >
              {isRunning ? "Pause" : "Start"}
            </button>
          </div>

          <p className="flex-none text-center text-xs opacity-50">
            {armedIndex >= 0
              ? `Marking line ${armedIndex + 1} of ${syncDoc.lineOrder.length}`
              : needsFinish
                ? "All lines marked -- tap Finish to close the last line."
                : "All lines marked."}
          </p>
        </>
      )}

      {wordSyncLineId && syncDoc.lines[wordSyncLineId] && (
        <WordSyncEditor
          line={syncDoc.lines[wordSyncLineId]}
          audioRef={audioRef}
          onWordsChange={setLineWords}
          onClose={() => setWordSyncLineId(null)}
        />
      )}

      {confirmingRemoveAudio && (
        <ConfirmDialog
          title="Remove audio?"
          body="The synced timing stays -- only the audio attachment is removed."
          confirmLabel="Remove"
          onCancel={() => setConfirmingRemoveAudio(false)}
          onConfirm={async () => {
            await removeAudio();
            setConfirmingRemoveAudio(false);
          }}
        />
      )}
    </div>
  );
};

export default SyncPanel;
