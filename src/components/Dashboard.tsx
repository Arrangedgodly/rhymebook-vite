import { useState } from "react";
import { useParams } from "react-router-dom";
import useDashboardLogic from "../hooks/useDashboardLogic";
import SuggestionPanel, { type SheetState } from "./SuggestionPanel";
import SyncPanel from "./SyncPanel";
import PlayPanel from "./PlayPanel";
import type { AppUser } from "../types/user";

interface DashboardProps {
  currentUser: AppUser | null;
}

const NEXT_SHEET: Record<SheetState, SheetState> = {
  peek: "half",
  half: "full",
  full: "peek",
};

type Mode = "write" | "sync" | "play";
const MODES: { id: Mode; label: string }[] = [
  { id: "write", label: "Write" },
  { id: "sync", label: "Sync" },
  { id: "play", label: "Play" },
];

const Dashboard = ({ currentUser }: DashboardProps) => {
  const { existingNoteId } = useParams<{ existingNoteId?: string }>();
  const [sheetState, setSheetState] = useState<SheetState>("half");
  // Local UI state, not a route param: switching modes shouldn't remount the
  // page or interrupt audio playback / scroll position.
  const [mode, setMode] = useState<Mode>("write");

  const {
    noteId,
    title,
    setTitle,
    lyrics,
    setLyrics,
    themes,
    setThemes,
    suggestions,
    settings,
    lastWord,
    lyricsRef,
    activeCategory,
    setActiveCategory,
    definition,
    definitionWord,
    definitionState,
    lookUpWord,
    clearDefinition,
    handleSave,
    handleReset,
    handleLeftClick,
    handleKeyDown,
  } = useDashboardLogic({ currentUser, existingNoteId });

  return (
    <div className="flex h-full min-h-0 w-full flex-col">
      <div
        role="tablist"
        aria-label="Song view"
        className="flex flex-none items-center gap-1 border-b border-base-300 px-3 md:px-5"
      >
        {MODES.map(({ id, label }) => (
          <button
            key={id}
            role="tab"
            type="button"
            aria-selected={mode === id}
            onClick={() => setMode(id)}
            className={[
              "-mb-px border-b-2 px-3 py-2 text-sm font-medium transition",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
              mode === id
                ? "border-primary text-primary"
                : "border-transparent opacity-60 hover:opacity-100",
            ].join(" ")}
          >
            {label}
          </button>
        ))}
      </div>

      {mode === "write" && (
        <div className="flex min-h-0 flex-1 flex-col md:flex-row">
          {/* ---- editor column ---- */}
          <div className="flex min-h-0 flex-1 flex-col">
            {/* Keep the writing measure readable rather than letting it span a wide monitor. */}
            <div className="mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col">
            <header className="flex flex-none items-center gap-2 border-b border-base-300 px-3 py-2 md:px-5">
              <input
                type="text"
                aria-label="Title"
                placeholder="Untitled"
                className="min-w-0 flex-1 bg-transparent text-lg font-semibold outline-none placeholder:opacity-40"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <button
                type="button"
                onClick={handleSave}
                disabled={!currentUser}
                title={
                  currentUser
                    ? "Save to your notebook - it autosaves from then on"
                    : "Log in to save notes"
                }
                className="btn btn-primary btn-sm"
              >
                Save
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="btn btn-ghost btn-sm"
              >
                Reset
              </button>
            </header>

            <div className="flex flex-none items-center gap-2 border-b border-base-300 px-3 py-1.5 md:px-5">
              <label
                htmlFor="note-themes"
                className="flex-none text-[0.68rem] font-medium uppercase tracking-wider opacity-55"
              >
                Themes
              </label>
              <input
                id="note-themes"
                type="text"
                placeholder="ocean, midnight - steers the suggestions"
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:opacity-40"
                value={themes}
                onChange={(e) => setThemes(e.target.value)}
              />
            </div>

            <textarea
              ref={lyricsRef}
              aria-label="Lyrics"
              placeholder="Start writing. Finish a word and the suggestions follow."
              className="min-h-0 w-full flex-1 resize-none bg-transparent px-3 py-3 text-lg
                         leading-loose outline-none placeholder:opacity-40 md:px-5"
              value={lyrics}
              onChange={(e) => setLyrics(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            </div>
          </div>

          {/* ---- suggestions: bottom sheet on a phone, right dock on desktop ---- */}
          <SuggestionPanel
            suggestions={suggestions}
            settings={settings}
            lastWord={lastWord}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            onSelect={handleLeftClick}
            onInspect={lookUpWord}
            definition={definition}
            definitionWord={definitionWord}
            definitionState={definitionState}
            onCloseDefinition={clearDefinition}
            sheetState={sheetState}
            onCycleSheet={() => setSheetState((s) => NEXT_SHEET[s])}
          />
        </div>
      )}

      {mode === "sync" && (
        <SyncPanel currentUser={currentUser} noteId={noteId} lyrics={lyrics} title={title} />
      )}

      {mode === "play" && <PlayPanel currentUser={currentUser} noteId={noteId} />}
    </div>
  );
};

export default Dashboard;
