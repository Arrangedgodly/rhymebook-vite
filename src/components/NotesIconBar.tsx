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
  /**
   * The function toggles the active tab between "tags" and an empty string.
   */
  const handleTagsClick = () => {
    if (activeTab === "tags") {
      setActiveTab("");
    } else {
      setActiveTab("tags");
    }
  }

  /**
   * This function toggles the active tab between "notebook" and an empty string.
   */
  const handleNotebookClick = () => {
    if (activeTab === "notebook") {
      setActiveTab("");
    } else {
      setActiveTab("notebook");
    }
  }
  return (
    <div className="flex flex-col w-[1/12] items-center bg-accent h-full relative z-10">
        <button
          className={
            activeTab === "notebook" ? "button-note_active" : "button-note"
          }
          onClick={handleNotebookClick}
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
          onClick={handleTagsClick}
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