import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getSyncDoc } from "../utils/syncApi";
import type { SyncDoc } from "../types/sync";
import type { AppUser } from "../types/user";

interface UsePlayLogicProps {
  currentUser: AppUser | null;
  noteId: string;
}

/** Play should open paused and remember/restore the last position per song. */
const usePlayLogic = ({ currentUser, noteId }: UsePlayLogicProps) => {
  const [syncDoc, setSyncDoc] = useState<SyncDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);
  const rafRef = useRef<number | null>(null);
  /** `performance.now()` when the local (audio-less) clock last resumed. */
  const clockStartRef = useRef<number | null>(null);
  /** Seconds elapsed before the clock's current run. */
  const clockBaseRef = useRef(0);
  const isPlayingRef = useRef(false);
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  const uid = currentUser?.uid ?? null;
  const positionKey = useMemo(
    () => `sync-position:${uid ?? "anon"}:${noteId}`,
    [uid, noteId]
  );
  const hasAudio = Boolean(syncDoc?.audio);

  const persistPosition = useCallback(
    (time: number) => {
      try {
        localStorage.setItem(positionKey, String(time));
      } catch {
        // Private-mode storage can throw; losing the resume point isn't fatal.
      }
    },
    [positionKey]
  );

  // Load the sync doc and restore the last local-clock position (audio
  // position is restored separately, once the <audio> element exists).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!noteId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      const doc = await getSyncDoc(noteId);
      if (cancelled) return;
      setSyncDoc(doc);
      setLoading(false);
      const saved = Number(localStorage.getItem(positionKey));
      if (Number.isFinite(saved) && saved > 0) {
        clockBaseRef.current = saved;
        setCurrentTime(saved);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [noteId, positionKey]);

  // Restore the audio element's position once it and the doc are both ready.
  useEffect(() => {
    const audioEl = audioRef.current;
    if (!audioEl || !hasAudio) return;
    const saved = Number(localStorage.getItem(positionKey));
    if (!Number.isFinite(saved) || saved <= 0) return;
    const apply = () => {
      audioEl.currentTime = saved;
    };
    if (audioEl.readyState >= 1) apply();
    else audioEl.addEventListener("loadedmetadata", apply, { once: true });
    return () => audioEl.removeEventListener("loadedmetadata", apply);
  }, [hasAudio, positionKey]);

  // Drive `currentTime` while playing -- from the audio element when one
  // exists, otherwise a local clock, so a teleprompter with no audio still runs.
  useEffect(() => {
    if (!isPlaying) return;
    const audioEl = audioRef.current;
    if (audioEl && hasAudio) {
      const onTimeUpdate = () => setCurrentTime(audioEl.currentTime);
      audioEl.addEventListener("timeupdate", onTimeUpdate);
      return () => audioEl.removeEventListener("timeupdate", onTimeUpdate);
    }
    clockStartRef.current = performance.now();
    const tick = () => {
      const start = clockStartRef.current ?? performance.now();
      setCurrentTime(clockBaseRef.current + (performance.now() - start) / 1000);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [isPlaying, hasAudio]);

  // Persist position on unmount (e.g. switching away from the Play tab)
  // when it wasn't already saved by an explicit pause/seek.
  useEffect(() => {
    const audioEl = audioRef.current;
    return () => {
      if (!isPlayingRef.current) return;
      const time =
        audioEl && hasAudio
          ? audioEl.currentTime
          : clockBaseRef.current +
            (clockStartRef.current !== null
              ? (performance.now() - clockStartRef.current) / 1000
              : 0);
      persistPosition(time);
    };
  }, [hasAudio, persistPosition]);

  const play = useCallback(() => {
    if (audioRef.current && hasAudio) {
      audioRef.current.play();
    } else {
      clockStartRef.current = performance.now();
    }
    setIsPlaying(true);
  }, [hasAudio]);

  const pause = useCallback(() => {
    if (audioRef.current && hasAudio) {
      audioRef.current.pause();
      persistPosition(audioRef.current.currentTime);
    } else {
      if (clockStartRef.current !== null) {
        clockBaseRef.current += (performance.now() - clockStartRef.current) / 1000;
        clockStartRef.current = null;
      }
      persistPosition(clockBaseRef.current);
    }
    setIsPlaying(false);
  }, [hasAudio, persistPosition]);

  const seek = useCallback(
    (time: number) => {
      if (audioRef.current && hasAudio) {
        audioRef.current.currentTime = time;
      } else {
        clockBaseRef.current = time;
        if (clockStartRef.current !== null) clockStartRef.current = performance.now();
      }
      setCurrentTime(time);
      persistPosition(time);
    },
    [hasAudio, persistPosition]
  );

  const reset = useCallback(() => {
    pause();
    seek(0);
  }, [pause, seek]);

  const activeLineId = useMemo(() => {
    if (!syncDoc) return null;
    for (const lineId of syncDoc.lineOrder) {
      const line = syncDoc.lines[lineId];
      if (
        line?.start !== null &&
        line?.end !== null &&
        currentTime >= line.start &&
        currentTime < line.end
      ) {
        return lineId;
      }
    }
    return null;
  }, [syncDoc, currentTime]);

  return {
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
  };
};

export default usePlayLogic;
