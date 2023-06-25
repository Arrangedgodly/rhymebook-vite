import useNotesLogic from "../hooks/useNotesLogic";
import NotesIconBar from "./NotesIconBar";
import NotesSideBar from "./NotesSideBar";
import NotesContent from "./NotesContent";
import { Suspense } from "react";
import Loading from "./Loading";

interface NotesProps {
  currentUser: any;
}

const Notes = ({ currentUser }: NotesProps) => {
  const {
    notes,
    addBlankNote,
    activeNote,
    setActiveNote,
    handlePinClick,
    handleNoteSave,
    deleteNote,
    handleSelectedNotes,
    selectedNotes
  } = useNotesLogic({
    currentUser,
  });
  return (
    <div className="container-notes">
      <NotesIconBar
        addBlankNote={addBlankNote}
      />
      <NotesSideBar
        notes={notes}
        activeNote={activeNote}
        setActiveNote={setActiveNote}
      />
      <Suspense fallback={<Loading />}>
        <NotesContent
          notes={notes}
          activeNote={activeNote}
          setActiveNote={setActiveNote}
          handlePinClick={handlePinClick}
          handleNoteSave={handleNoteSave}
          handleSelectedNotes={handleSelectedNotes}
          selectedNotes={selectedNotes}
          deleteNote={deleteNote}
        />
      </Suspense>
    </div>
  );
};

export default Notes;
