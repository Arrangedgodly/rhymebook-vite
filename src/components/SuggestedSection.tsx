interface SuggestedSectionProps {
  title: string;
  words: string[];
  handleRightClick: (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    word: string
  ) => void;
  handleLeftClick: (word: string) => void;
}

const SuggestedSection = ({
  title,
  words,
  handleRightClick,
  handleLeftClick,
}: SuggestedSectionProps) => {
  return (
    <>
      <h3 className="text-md mt-2 mb-1">{title}</h3>
      <div className="flex flex-row flex-wrap justify-around w-4/5">
        {words.map((word) => (
          <span
            className="badge badge-accent badge-sm m-1 hover:badge-secondary hover:cursor-context-menu"
            key={`${title}-${word}`}
            onContextMenu={(e) => handleRightClick(e, word)}
            onClick={() => handleLeftClick(word)}
          >
            {word}
          </span>
        ))}
      </div>
    </>
  );
};

export default SuggestedSection;
