import {
  BookOpenIcon,
  TagIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/solid";

interface NotesIconBarProps {
  addBlankNote: () => void;
}

const NotesIconBar = ({ addBlankNote }: NotesIconBarProps) => {
  return (
    <div className="flex flex-col w-[1/12] items-center bg-accent h-full fixed z-10 top-0 left-0">
      <label htmlFor="notebook-drawer" className="button-note">
        <BookOpenIcon className="button-note-content" />
      </label>
      <label htmlFor="tags-drawer" className="button-note">
        <TagIcon className="button-note-content" />
      </label>
      <button className="button-note mt-auto" onClick={addBlankNote}>
        <PencilSquareIcon className="button-note-content" />
      </button>
    </div>
  );
};

export default NotesIconBar;
