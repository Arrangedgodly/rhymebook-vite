import { computeSyncStatus } from "../types/sync";
import type { SyncDoc } from "../types/sync";

function formatLrcTimestamp(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds - m * 60;
  return `${m.toString().padStart(2, "0")}:${s.toFixed(2).padStart(5, "0")}`;
}

/** Standard `[mm:ss.xx]line text` lyric format, widely recognized by lyric/karaoke tools. */
export function toLrc(syncDoc: SyncDoc, title: string): string {
  const lines = syncDoc.lineOrder
    .map((id) => syncDoc.lines[id])
    .filter((line): line is typeof line & { start: number } => line.start !== null)
    .sort((a, b) => a.start - b.start)
    .map((line) => `[${formatLrcTimestamp(line.start)}]${line.text}`);

  return [`[ti:${title || "Untitled"}]`, ...lines].join("\n");
}

/** Full-fidelity machine-readable export, including word timing when present. */
export function toExportJson(syncDoc: SyncDoc, title: string): unknown {
  return {
    title: title || "Untitled",
    status: computeSyncStatus(syncDoc),
    lines: syncDoc.lineOrder.map((id) => {
      const line = syncDoc.lines[id];
      return {
        text: line.text,
        start: line.start,
        end: line.end,
        words: line.words?.map((w) => ({ text: w.text, start: w.start, end: w.end })),
      };
    }),
  };
}

/** A filesystem-safe slug for the download filename, falling back when the title is empty. */
export function slugForFilename(title: string): string {
  const slug = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "song";
}

export function downloadTextFile(filename: string, content: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
