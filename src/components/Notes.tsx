import useNotesLogic from "../hooks/useNotesLogic";
import NotesIconBar from "./NotesIconBar";
import NotesSideBar from "./NotesSideBar";
import NotesContent from "./NotesContent";

interface NotesProps {
  currentUser: any;
}

const Notes = ({ currentUser }: NotesProps) => {
  const {
    notes,
    pinnedNotes,
    activeTab,
    setActiveTab,
    addBlankNote,
    activeNote,
    setActiveNote,
    handlePinClick,
  } = useNotesLogic({
    currentUser,
  });
  return (
    <div className="container-notes">
      <NotesIconBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        addBlankNote={addBlankNote}
      />
      <NotesSideBar
        activeTab={activeTab}
        notes={notes}
        activeNote={activeNote}
        setActiveNote={setActiveNote}
      />
      <NotesContent
        notes={notes}
        activeNote={activeNote}
        setActiveNote={setActiveNote}
        handlePinClick={handlePinClick}
        pinnedNotes={pinnedNotes}
      />
    </div>
  );
};

export default Notes;
