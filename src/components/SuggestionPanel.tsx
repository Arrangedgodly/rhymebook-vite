import DefinitionView from "./DefinitionView";
import WordChip from "./WordChip";
import { RELATIONS, RELATION_KEYS, type RelationKey } from "../utils/rhymeApi";
import type { Suggestions } from "../hooks/useDashboardLogic";
import type { RhymeSettings } from "../types/settings";
import type { DictionaryEntry } from "../utils/dictionaryApi";

export type SheetState = "peek" | "half" | "full";

const STATE_LABEL: Record<SheetState, string> = {
  peek: "Expand suggestions",
  half: "Expand suggestions further",
  full: "Collapse suggestions",
};

interface SuggestionPanelProps {
  suggestions: Suggestions;
  settings: RhymeSettings;
  lastWord: string;
  activeCategory: RelationKey;
  onCategoryChange: (key: RelationKey) => void;
  onSelect: (word: string) => void;
  onInspect: (word: string) => void;
  definition: DictionaryEntry | null;
  definitionWord: string;
  definitionState: "idle" | "loading" | "empty" | "error" | "ready";
  onCloseDefinition: () => void;
  sheetState: SheetState;
  onCycleSheet: () => void;
}

const SuggestionPanel = ({
  suggestions,
  settings,
  lastWord,
  activeCategory,
  onCategoryChange,
  onSelect,
  onInspect,
  definition,
  definitionWord,
  definitionState,
  onCloseDefinition,
  sheetState,
  onCycleSheet,
}: SuggestionPanelProps) => {
  const categories = RELATION_KEYS.filter((key) => settings.enabled[key]);

  // Several categories come back empty for most words -- Sound-Alikes and
  // Antonyms especially -- so if the chosen tab has nothing, show the first
  // one that does rather than an empty panel.
  const firstWithWords = categories.find((key) => suggestions[key].length > 0);
  const shown =
    suggestions[activeCategory]?.length > 0
      ? activeCategory
      : firstWithWords ?? activeCategory;

  const words = suggestions[shown] ?? [];
  const showingDefinition = definitionState !== "idle";

  return (
    <aside
      className="suggest z-20 flex w-full flex-none flex-col border-t border-base-300 bg-base-100
                 md:h-full md:w-80 md:flex-none md:border-l md:border-t-0 lg:w-96"
      data-state={sheetState}
      aria-label="Word suggestions"
    >
      {/* Grab handle: the sheet only exists on small screens. */}
      <button
        type="button"
        onClick={onCycleSheet}
        aria-label={STATE_LABEL[sheetState]}
        className="flex w-full flex-none cursor-pointer flex-col items-center gap-1 pt-2 pb-1
                   focus-visible:outline-2 focus-visible:outline-offset-[-2px]
                   focus-visible:outline-primary md:hidden"
      >
        <span className="h-1 w-9 rounded-full bg-base-content/25" />
      </button>

      {/* Category tabs, each carrying its result count. */}
      <div
        role="tablist"
        aria-label="Suggestion categories"
        className="no-bar flex flex-none gap-1 overflow-x-auto px-2 py-2 md:flex-wrap md:overflow-x-visible"
      >
        {categories.map((key) => {
          const count = suggestions[key].length;
          const selected = key === shown;
          return (
            <button
              key={key}
              role="tab"
              type="button"
              aria-selected={selected}
              disabled={count === 0}
              onClick={() => onCategoryChange(key)}
              className={[
                "flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                selected
                  ? "border-primary bg-primary text-primary-content"
                  : "border-base-300 text-base-content/70 hover:border-base-content/40 hover:text-base-content",
                count === 0 ? "cursor-not-allowed opacity-40" : "",
              ].join(" ")}
            >
              <span>{RELATIONS[key].label}</span>
              <span className="text-[0.65rem] tabular-nums opacity-70">{count}</span>
            </button>
          );
        })}
      </div>

      {showingDefinition ? (
        <DefinitionView
          word={definitionWord}
          entry={definition}
          state={definitionState}
          onClose={onCloseDefinition}
        />
      ) : (
        <div className="suggest-chips no-bar flex min-h-0 flex-1 content-start gap-1.5 px-2 pb-3">
          {words.length > 0 ? (
            words.map(({ word }) => (
              <WordChip
                key={`${shown}-${word}`}
                word={word}
                onSelect={onSelect}
                onInspect={onInspect}
              />
            ))
          ) : (
            <p className="px-1 py-2 text-sm opacity-60">
              {lastWord
                ? `Nothing found for "${lastWord}".`
                : "Finish a word to see suggestions."}
            </p>
          )}
        </div>
      )}
    </aside>
  );
};

export default SuggestionPanel;
