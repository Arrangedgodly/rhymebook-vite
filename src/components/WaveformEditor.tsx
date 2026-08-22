import { useEffect, useRef, useState, type RefObject } from "react";
import type WaveSurfer from "wavesurfer.js";
import type RegionsPluginType from "wavesurfer.js/dist/plugins/regions.js";
import type { Region } from "wavesurfer.js/dist/plugins/regions.js";
import type { SyncDoc } from "../types/sync";

interface WaveformEditorProps {
  syncDoc: SyncDoc;
  /**
   * The same `<audio>` element `useSyncLogic` owns, passed as a ref rather
   * than its dereferenced value -- reading `.current` happens inside this
   * component's own effect, not during either component's render.
   */
  audioRef: RefObject<HTMLAudioElement | null>;
  onLineTimingChange: (lineId: string, start: number, end: number) => void;
}

const MIN_PX_PER_SEC = 20;
const MAX_PX_PER_SEC = 500;
const DEFAULT_PX_PER_SEC = 80;

function formatSeconds(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds - m * 60;
  return `${m}:${s.toFixed(2).padStart(5, "0")}`;
}

/**
 * Fine-tunes line timing by dragging/resizing regions on a waveform. Reuses
 * the same `<audio>` element `useSyncLogic` already owns (via wavesurfer's
 * `media` option) rather than creating a second one, so this can sit
 * alongside the fast-sync capture UI without fighting over playback.
 */
const WaveformEditor = ({ syncDoc, audioRef, onLineTimingChange }: WaveformEditorProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const primaryColorRef = useRef<HTMLSpanElement>(null);
  const mutedColorRef = useRef<HTMLSpanElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const regionsRef = useRef<RegionsPluginType | null>(null);
  const lastSnapshotRef = useRef<string | null>(null);
  const onLineTimingChangeRef = useRef(onLineTimingChange);

  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [selectedLineId, setSelectedLineId] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(DEFAULT_PX_PER_SEC);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    onLineTimingChangeRef.current = onLineTimingChange;
  }, [onLineTimingChange]);

  // Create the wavesurfer instance once an audio element exists. Colors are
  // read off the app's own theme (via computed style on hidden refs) rather
  // than hardcoding a palette, so this tracks whatever daisyUI theme is active.
  useEffect(() => {
    const audioEl = audioRef.current;
    if (!containerRef.current || !audioEl) return;
    let cancelled = false;

    (async () => {
      try {
        const [{ default: WaveSurferCtor }, { default: RegionsPluginCtor }] =
          await Promise.all([
            import("wavesurfer.js"),
            import("wavesurfer.js/dist/plugins/regions.js"),
          ]);
        if (cancelled || !containerRef.current) return;

        const progressColor = primaryColorRef.current
          ? getComputedStyle(primaryColorRef.current).color
          : undefined;
        const waveColor = mutedColorRef.current
          ? getComputedStyle(mutedColorRef.current).color
          : undefined;

        const ws = WaveSurferCtor.create({
          container: containerRef.current,
          media: audioEl,
          height: 96,
          minPxPerSec: DEFAULT_PX_PER_SEC,
          waveColor,
          progressColor,
          cursorColor: progressColor,
        });
        const regions = ws.registerPlugin(RegionsPluginCtor.create());

        regions.on("region-updated", (region: Region) => {
          onLineTimingChangeRef.current(region.id, region.start, region.end);
        });
        regions.on("region-clicked", (region: Region, e: MouseEvent) => {
          e.stopPropagation();
          setSelectedLineId(region.id);
          ws.setTime(region.start);
        });

        ws.on("ready", () => setReady(true));
        ws.on("error", () => setLoadError(true));
        ws.on("play", () => setIsPlaying(true));
        ws.on("pause", () => setIsPlaying(false));
        ws.on("timeupdate", (time) => setCurrentTime(time));

        wavesurferRef.current = ws;
        regionsRef.current = regions;
      } catch {
        if (!cancelled) setLoadError(true);
      }
    })();

    return () => {
      cancelled = true;
      regionsRef.current = null;
      // Safe against the shared `audioEl`: destroy() doesn't touch an
      // externally-provided media element, only wavesurfer's own DOM/state.
      wavesurferRef.current?.destroy();
      wavesurferRef.current = null;
      setReady(false);
    };
  }, [audioRef]);

  // Rebuild regions only when the lyrics themselves changed (a reconciliation
  // ran and line identities may have shifted) -- not on every syncDoc update,
  // so a write this editor just made doesn't fight its own in-progress drag.
  useEffect(() => {
    const regions = regionsRef.current;
    if (!ready || !regions) return;
    if (lastSnapshotRef.current === syncDoc.lyricsSnapshot) return;
    lastSnapshotRef.current = syncDoc.lyricsSnapshot;

    regions.clearRegions();
    for (const lineId of syncDoc.lineOrder) {
      const line = syncDoc.lines[lineId];
      if (line.start === null || line.end === null) continue;
      regions.addRegion({
        id: lineId,
        start: line.start,
        end: line.end,
        content: line.text,
        drag: true,
        resize: true,
      });
    }
  }, [ready, syncDoc]);

  const handleZoom = (value: number) => {
    setZoomLevel(value);
    wavesurferRef.current?.zoom(value);
  };

  const hasTimedLines = syncDoc.lineOrder.some(
    (lineId) => syncDoc.lines[lineId]?.start !== null
  );
  const selectedLine = selectedLineId ? syncDoc.lines[selectedLineId] : null;

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2">
      {/* Hidden probes: read the app's actual theme colors via computed style. */}
      <span ref={primaryColorRef} className="hidden text-primary" aria-hidden="true" />
      <span ref={mutedColorRef} className="hidden text-base-content/30" aria-hidden="true" />

      {loadError && (
        <p className="text-sm text-error">Couldn't load the waveform for this audio.</p>
      )}

      {!hasTimedLines && (
        <p className="text-xs opacity-60">
          No marked lines yet -- use Fast Sync first, then fine-tune the timing here.
        </p>
      )}

      <div
        ref={containerRef}
        className="w-full flex-none rounded-md border border-base-300 bg-base-200/40"
      />

      {selectedLine && (
        <p className="text-xs opacity-70">
          <span className="font-medium">{selectedLine.text}</span>
          {" -- "}
          {formatSeconds(selectedLine.start ?? 0)} to {formatSeconds(selectedLine.end ?? 0)}
        </p>
      )}

      <div className="flex flex-none items-center gap-3">
        <button
          type="button"
          className="btn btn-outline btn-sm"
          disabled={!ready}
          onClick={() => void wavesurferRef.current?.playPause()}
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
        <span className="w-14 flex-none text-xs tabular-nums opacity-60">
          {formatSeconds(currentTime)}
        </span>
        <label className="flex flex-1 items-center gap-2 text-xs opacity-60">
          Zoom
          <input
            type="range"
            min={MIN_PX_PER_SEC}
            max={MAX_PX_PER_SEC}
            value={zoomLevel}
            disabled={!ready}
            onChange={(e) => handleZoom(Number(e.target.value))}
            className="range range-primary range-xs flex-1"
          />
        </label>
      </div>
    </div>
  );
};

export default WaveformEditor;
