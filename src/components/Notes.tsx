import useNotesLogic from "../hooks/useNotesLogic";
import NotesIconBar from "./NotesIconBar";
import NotesSideBar from "./NotesSideBar";
import NotesContent from "./NotesContent";

interface NotesProps {
  currentUser: any;
}

const Notes = ({ currentUser }: NotesProps) => {
  const { notes, activeTab, setActiveTab, addBlankNote } = useNotesLogic({
    currentUser,
  });
  return (
    <div className="container-notes">
      <NotesIconBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        addBlankNote={addBlankNote}
      />
      <NotesSideBar activeTab={activeTab} notes={notes} />
      <NotesContent />
    </div>
  );
};

export default Notes;
