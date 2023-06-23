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
    pinnedNotes,
    activeTab,
    setActiveTab,
    addBlankNote,
    activeNote,
    setActiveNote,
    handlePinClick,
    handleSelectedNotes,
    selectedNotes
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
      {activeTab && (
        <NotesSideBar
        activeTab={activeTab}
        notes={notes}
        activeNote={activeNote}
        setActiveNote={setActiveNote}
      />
      )}
      <Suspense fallback={<Loading />}>
      <NotesContent
        notes={notes}
        activeNote={activeNote}
        setActiveNote={setActiveNote}
        handlePinClick={handlePinClick}
        pinnedNotes={pinnedNotes}
        handleSelectedNotes={handleSelectedNotes}
        selectedNotes={selectedNotes}
      />
      </Suspense>
    </div>
  );
};

export default Notes;
