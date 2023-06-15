import {
  BookOpenIcon,
  TagIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/solid";
import useNotesLogic from "../hooks/useNotesLogic";

interface NotesProps {
  currentUser: any;
}

const Notes = ({ currentUser }: NotesProps) => {
  const { notes, activeTab, setActiveTab, addBlankNote } = useNotesLogic({ currentUser });
  return (
    <div className="container-notes">
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
      <div className="flex flex-col w-3/10 items-center bg-base-300 text-secondary h-full relative z-10">
        {activeTab === "notebook" && (
          <>
            {notes && notes.map((note: any) => (
              <>
              <div key={note.id} className='badge badge-outline badge-lg m-5'>
                <h1 className='text-lg font-bold'>{note.title}</h1>
              </div>
              </>
            ))}
          </>
        )}
      </div>
      <div className="flex flex-col w-6/10 items-center h-full relative z-0"></div>
    </div>
  );
};

export default Notes;
