import {
  deleteField,
  doc,
  getDoc,
  getFirestore,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import { splitLyricLines } from "./lyrics";
import { reconcileLines } from "./syncDiff";
import type { LineTiming, SyncAudio, SyncDoc, SyncWarning } from "../types/sync";

function syncDocRef(noteId: string) {
  return doc(getFirestore(), "notes", noteId, "sync", "main");
}

function toSyncDoc(id: string, data: Record<string, unknown>): SyncDoc {
  return { ...(data as Omit<SyncDoc, "id">), id };
}

function newLine(text: string, index: number): LineTiming {
  return {
    lineId: crypto.randomUUID(),
    snapshotIndex: index,
    text,
    start: null,
    end: null,
    source: "fast-sync",
  };
}

export async function getSyncDoc(noteId: string): Promise<SyncDoc | null> {
  const snap = await getDoc(syncDocRef(noteId));
  return snap.exists() ? toSyncDoc(snap.id, snap.data()) : null;
}

/** Loads the sync doc, or creates one seeded from the current lyrics if none exists. */
export async function ensureSyncDoc(
  noteId: string,
  uid: string,
  lyrics: string
): Promise<SyncDoc> {
  const existing = await getSyncDoc(noteId);
  if (existing) return existing;

  const snapshotLines = splitLyricLines(lyrics);
  const lines: Record<string, LineTiming> = {};
  const lineOrder: string[] = [];
  snapshotLines.forEach((text, index) => {
    const line = newLine(text, index);
    lines[line.lineId] = line;
    lineOrder.push(line.lineId);
  });

  const payload = {
    lyricsSnapshot: lyrics,
    snapshotLines,
    lines,
    lineOrder,
    needsReview: false,
    warnings: [] as SyncWarning[],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    createdBy: uid,
  };
  await setDoc(syncDocRef(noteId), payload);
  return { id: "main", ...payload };
}

/**
 * Re-aligns line timing against the current lyrics text. Matched lines (via
 * `reconcileLines`) carry their timing forward untouched; lines with no safe
 * match are never deleted -- old ones are flagged `needsReview`, new ones
 * start untimed. See `reconcileLines` for the matching rules.
 */
export async function reconcileSync(
  noteId: string,
  currentLyrics: string
): Promise<SyncDoc> {
  const existing = await getSyncDoc(noteId);
  if (!existing) {
    throw new Error(`No sync doc for note ${noteId} to reconcile`);
  }

  const newSnapshotLines = splitLyricLines(currentLyrics);
  const { matches, orphanedOldIndices } = reconcileLines(
    existing.snapshotLines,
    newSnapshotLines
  );

  const matchedLineIdByNewIndex = new Map<number, string>();
  for (const { oldIndex, newIndex } of matches) {
    matchedLineIdByNewIndex.set(newIndex, existing.lineOrder[oldIndex]);
  }

  const lines: Record<string, LineTiming> = {};
  const lineOrder: string[] = [];
  newSnapshotLines.forEach((text, newIndex) => {
    const matchedLineId = matchedLineIdByNewIndex.get(newIndex);
    if (matchedLineId) {
      lines[matchedLineId] = {
        ...existing.lines[matchedLineId],
        snapshotIndex: newIndex,
        text,
      };
      lineOrder.push(matchedLineId);
    } else {
      const line = newLine(text, newIndex);
      lines[line.lineId] = line;
      lineOrder.push(line.lineId);
    }
  });

  // Orphaned lines are kept -- addressable for review -- but excluded from
  // lineOrder since their text no longer corresponds to any current line.
  for (const oldIndex of orphanedOldIndices) {
    const oldLineId = existing.lineOrder[oldIndex];
    lines[oldLineId] = { ...existing.lines[oldLineId], needsReview: true };
  }

  const payload = {
    lyricsSnapshot: currentLyrics,
    snapshotLines: newSnapshotLines,
    lines,
    lineOrder,
    needsReview: orphanedOldIndices.length > 0,
    updatedAt: serverTimestamp(),
  };
  await updateDoc(syncDocRef(noteId), payload);
  return { ...existing, ...payload };
}

/** A line whose text no longer matches any current lyric line. Its old timing is irrelevant now. */
export async function discardOrphanedLine(
  noteId: string,
  lineId: string
): Promise<void> {
  const existing = await getSyncDoc(noteId);
  if (!existing) return;
  const stillHasOrphans = Object.values(existing.lines).some(
    (line) =>
      line.lineId !== lineId &&
      line.needsReview &&
      !existing.lineOrder.includes(line.lineId)
  );
  await updateDoc(syncDocRef(noteId), {
    [`lines.${lineId}`]: deleteField(),
    needsReview: stillHasOrphans,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Writes one or more line-timing patches in a single update, so a fast-sync
 * "mark" (which closes the previous line and opens the next) lands
 * atomically rather than as two separate writes.
 */
export async function recordLineTimings(
  noteId: string,
  patches: { lineId: string; patch: Partial<Omit<LineTiming, "lineId">> }[]
): Promise<void> {
  if (patches.length === 0) return;
  const updates: Record<string, unknown> = { updatedAt: serverTimestamp() };
  for (const { lineId, patch } of patches) {
    for (const [key, value] of Object.entries(patch)) {
      updates[`lines.${lineId}.${key}`] = value;
    }
  }
  await updateDoc(syncDocRef(noteId), updates);
}

export async function recordLineTiming(
  noteId: string,
  lineId: string,
  patch: Partial<Omit<LineTiming, "lineId">>
): Promise<void> {
  await recordLineTimings(noteId, [{ lineId, patch }]);
}

function probeAudioDuration(file: File): Promise<number | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const probe = new Audio();
    const cleanup = () => URL.revokeObjectURL(url);
    probe.addEventListener("loadedmetadata", () => {
      cleanup();
      resolve(Number.isFinite(probe.duration) ? probe.duration : null);
    });
    probe.addEventListener("error", () => {
      cleanup();
      resolve(null);
    });
    probe.src = url;
  });
}

/**
 * Extensions the browser is prone to mis-sniffing (WAV especially -- some
 * browsers report "", others a generic octet-stream type for it). Storage's
 * security rule requires an `audio/*` contentType, so an unreliable browser
 * guess would otherwise make a legitimate upload look unauthorized.
 */
const AUDIO_CONTENT_TYPES_BY_EXTENSION: Record<string, string> = {
  wav: "audio/wav",
  mp3: "audio/mpeg",
  m4a: "audio/mp4",
  aac: "audio/aac",
  ogg: "audio/ogg",
  oga: "audio/ogg",
  flac: "audio/flac",
  webm: "audio/webm",
};

function resolveAudioContentType(file: File): string {
  if (file.type.startsWith("audio/")) return file.type;
  const extension = file.name.split(".").pop()?.toLowerCase();
  return (extension && AUDIO_CONTENT_TYPES_BY_EXTENSION[extension]) || file.type;
}

/**
 * Uploads audio and points the sync doc at it in one call, so the Storage
 * object and the Firestore reference can never drift out of sync with each
 * other. Replacing existing audio removes the old Storage object and flags
 * the sync as needing a listen-through, without touching line timing.
 */
export async function attachAudio(
  noteId: string,
  uid: string,
  file: File
): Promise<SyncAudio> {
  const existing = await getSyncDoc(noteId);
  const storage = getStorage();
  const previousAudio = existing?.audio;
  const contentType = resolveAudioContentType(file);

  // The uploader's uid is embedded in the path -- storage.rules checks it
  // directly there rather than cross-referencing Firestore for write access.
  const path = `notes/${noteId}/sync/main/audio/${uid}/${Date.now()}-${file.name}`;
  const objectRef = storageRef(storage, path);
  await uploadBytes(objectRef, file, { contentType });
  const downloadUrl = await getDownloadURL(objectRef);
  const durationSeconds = await probeAudioDuration(file);

  const audio: SyncAudio = {
    storagePath: path,
    downloadUrl,
    contentType,
    durationSeconds,
    sizeBytes: file.size,
    uploadedAt: serverTimestamp(),
    uploadedBy: uid,
  };

  const warnings = (existing?.warnings ?? []).filter(
    (w) => w.code !== "audio-changed"
  );
  if (previousAudio) {
    warnings.push({
      code: "audio-changed",
      message: "Audio source changed - the existing sync should be verified against it.",
    });
  }

  await updateDoc(syncDocRef(noteId), {
    audio,
    warnings,
    updatedAt: serverTimestamp(),
  });

  if (previousAudio) {
    await deleteObject(storageRef(storage, previousAudio.storagePath)).catch(
      () => {
        // The doc already points at the new file; a leftover old object is a
        // storage-cleanup nicety, not something to fail the swap over.
      }
    );
  }

  return audio;
}

/** Removes the audio attachment. The sync (line timing) is preserved -- see decision #26/27 of the spec. */
export async function removeAudio(noteId: string): Promise<void> {
  const existing = await getSyncDoc(noteId);
  if (!existing?.audio) return;
  const storage = getStorage();
  await deleteObject(storageRef(storage, existing.audio.storagePath)).catch(
    () => {}
  );
  await updateDoc(syncDocRef(noteId), {
    audio: deleteField(),
    updatedAt: serverTimestamp(),
  });
}
