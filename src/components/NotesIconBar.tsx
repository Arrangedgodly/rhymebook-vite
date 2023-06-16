import {
  BookOpenIcon,
  TagIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/solid";

interface NotesIconBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  addBlankNote: () => void;
}

const NotesIconBar = ({ activeTab, setActiveTab, addBlankNote }: NotesIconBarProps) => {
  return (
    <div className="flex flex-col w-1/10 items-center bg-accent h-full relative z-10">
        <button
          className={
            activeTab === "notebook" ? "button-note_active" : "button-note"
          }
          onClick={() => setActiveTab("notebook")}
        >
          <BookOpenIcon
            className={
              activeTab === "notebook"
                ? "button-note-content_active"
                : "button-note-content"
            }
          />
        </button>
        <button
          className={
            activeTab === "tags" ? "button-note_active" : "button-note"
          }
          onClick={() => setActiveTab("tags")}
        >
          <TagIcon
            className={
              activeTab === "tags"
                ? "button-note-content_active"
                : "button-note-content"
            }
          />
        </button>
        <button className="button-note mt-auto" onClick={addBlankNote}>
          <PencilSquareIcon className="button-note-content" />
        </button>
      </div>
  )
}

export default NotesIconBar;