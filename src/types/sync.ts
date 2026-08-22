import type { FieldValue, Timestamp } from "firebase/firestore";

export type SyncStatus = "draft" | "complete";

/** How a line's timing was captured. "waveform" and manual word-level editing are later phases. */
export type TimingSource = "fast-sync" | "manual" | "waveform";

/**
 * Optional per-word timing, subordinate to its parent line. Not required for a
 * Complete sync. `start`/`end` are `null` until marked, same convention as
 * `LineTiming` -- a line's word list exists (and is persisted) as soon as its
 * word-sync editor is opened, not only once every word is captured.
 */
export interface WordTiming {
  text: string;
  start: number | null;
  end: number | null;
}

export interface LineTiming {
  lineId: string;
  /** Position in `lineOrder` as of the last reconciliation. Rendering/gap math only, not identity. */
  snapshotIndex: number;
  /** Exact line text this timing was captured against -- the diff's comparison key. */
  text: string;
  /** Seconds. `null` until marked. */
  start: number | null;
  end: number | null;
  source: TimingSource;
  words?: WordTiming[];
  /** Reconciliation couldn't confidently carry this line's timing forward -- needs manual attention. */
  needsReview?: boolean;
  updatedAt?: Timestamp | FieldValue;
}

export interface SyncAudio {
  /** Firebase Storage object path, e.g. notes/{noteId}/sync/main/audio/<filename>. */
  storagePath: string;
  /** Cached getDownloadURL() result, so playback never refetches it. */
  downloadUrl: string;
  contentType: string;
  durationSeconds: number | null;
  sizeBytes: number;
  uploadedAt: Timestamp | FieldValue;
  /** Provenance only -- not an access gate. */
  uploadedBy: string;
}

export interface SyncWarning {
  code: "large-gap" | "audio-changed" | "line-needs-review";
  lineId?: string;
  message: string;
}

export interface SyncDoc {
  /** "main" in v1 -- one sync per note. */
  id: string;
  /** Exact note.lyrics this sync's line data was last reconciled against. */
  lyricsSnapshot: string;
  /** Non-blank lines derived from lyricsSnapshot, in order -- the diff's "old" side. */
  snapshotLines: string[];
  lines: Record<string, LineTiming>;
  /** Map iteration order isn't guaranteed; this drives render/playback order. */
  lineOrder: string[];
  audio?: SyncAudio;
  needsReview: boolean;
  warnings: SyncWarning[];
  createdAt?: Timestamp | FieldValue;
  updatedAt?: Timestamp | FieldValue;
  createdBy: string;
}

/**
 * Derived, not stored: persisting status invites staleness bugs (forgetting to
 * recompute after every line edit), and recomputing from already-loaded data is
 * cheap and always correct.
 */
export function computeSyncStatus(doc: SyncDoc): SyncStatus {
  if (doc.needsReview) return "draft";
  const hasBlockingWarning = doc.warnings.some(
    (w) => w.code === "line-needs-review"
  );
  if (hasBlockingWarning) return "draft";

  const allTimed = doc.lineOrder.every((lineId) => {
    const line = doc.lines[lineId];
    return line && line.start !== null && line.end !== null && !line.needsReview;
  });
  return allTimed ? "complete" : "draft";
}
