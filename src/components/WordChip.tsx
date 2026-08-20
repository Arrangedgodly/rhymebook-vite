import { useLongPress } from "../hooks/useLongPress";

interface WordChipProps {
  word: string;
  onSelect: (word: string) => void;
  onInspect: (word: string) => void;
}

const WordChip = ({ word, onSelect, onInspect }: WordChipProps) => {
  const handlers = useLongPress({
    onClick: () => onSelect(word),
    onLongPress: () => onInspect(word),
  });

  return (
    <button
      type="button"
      className="word-chip badge badge-accent badge-lg shrink-0 cursor-pointer border-transparent
                 px-2.5 py-3 text-sm font-medium transition hover:badge-secondary
                 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      title={`${word} - tap to insert, hold for the definition`}
      {...handlers}
    >
      {word}
    </button>
  );
};

export default WordChip;
