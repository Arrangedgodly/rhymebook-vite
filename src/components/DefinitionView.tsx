import type { DictionaryEntry } from "../utils/dictionaryApi";

interface DefinitionViewProps {
  word: string;
  entry: DictionaryEntry | null;
  state: "idle" | "loading" | "empty" | "error" | "ready";
  onClose: () => void;
}

const DefinitionView = ({ word, entry, state, onClose }: DefinitionViewProps) => (
  <div className="flex min-h-0 flex-1 flex-col">
    <div className="flex flex-none items-center justify-between gap-2 px-3 pb-2">
      <h3 className="truncate text-base font-semibold">{word}</h3>
      <button
        type="button"
        onClick={onClose}
        className="btn btn-ghost btn-xs"
        aria-label="Back to suggestions"
      >
        Back
      </button>
    </div>

    <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-3 text-sm">
      {state === "loading" && (
        <p className="opacity-60">Looking it up...</p>
      )}
      {state === "empty" && (
        <p className="opacity-60">No dictionary entry for &ldquo;{word}&rdquo;.</p>
      )}
      {state === "error" && (
        <p className="opacity-60">
          The dictionary is not responding. Try again in a moment.
        </p>
      )}
      {state === "ready" &&
        entry?.meanings?.map((meaning, i) => (
          <div key={`${meaning.partOfSpeech}-${i}`} className="mb-3">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide opacity-60">
              {meaning.partOfSpeech}
            </p>
            <ol className="list-decimal space-y-1 pl-4">
              {meaning.definitions.slice(0, 4).map((sense, j) => (
                <li key={j}>
                  <span>{sense.definition}</span>
                  {sense.example && (
                    <span className="block italic opacity-60">
                      &ldquo;{sense.example}&rdquo;
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </div>
        ))}
    </div>
  </div>
);

export default DefinitionView;
