import { useState, useEffect, useRef } from "react";
import ActiveNote from "./ActiveNote";
import InactiveNote from "./InactiveNote";

interface NotesContentProps {
  notes: any;
  activeNote: any;
  setActiveNote: any;
  handlePinClick: any;
  handleNoteSave: any;
  handleSelectedNotes: any;
  selectedNotes: string[];
  deleteNote: any;
}

const NotesContent = ({
  notes,
  activeNote,
  setActiveNote,
  handlePinClick,
  handleNoteSave,
  handleSelectedNotes,
  selectedNotes,
  deleteNote,
}: NotesContentProps) => {
  const [hoveredNote, setHoveredNote] = useState(null);
  const [pendingNote, setPendingNote] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);
  const deleteDialogRef = useRef<HTMLDialogElement>(null);

  const openDeleteDialog = (note: string) => {
    setPendingNote?.(note);
    deleteDialogRef.current?.showModal();
  }

  const confirmDelete = () => {
    deleteNote?.(pendingNote);
    deleteDialogRef.current?.close();
  }

  /* This `useEffect` hook is used to scroll the notes container to the top when a new active note is
  selected. It checks if there is an active note and if the container reference exists, and then
  sets the `scrollTop` property of the container to 0 to scroll it to the top. The dependency array
  `[activeNote]` ensures that this effect only runs when the `activeNote` prop changes. */
  useEffect(() => {
    if (activeNote && containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [activeNote]);

  return (
    <div className="container-notes-content" ref={containerRef}>
      {activeNote && (
        <ActiveNote
          activeNote={activeNote}
          setActiveNote={setActiveNote}
          handleNoteSave={handleNoteSave}
        />
      )}
      {notes.filter((note: any) => note.isPinned).length > 0 && (
        <>
          <h3 className="text-note-title">Pinned Notes</h3>
          <div className="notes-grid">
            {notes
              .filter((note: any) => !activeNote || note.id !== activeNote.id)
              .filter((note: any) => note.isPinned)
              .map((note: any) => (
                <InactiveNote
                  key={`note-${note.id}`}
                  note={note}
                  setActiveNote={setActiveNote}
                  hoveredNote={hoveredNote}
                  setHoveredNote={setHoveredNote}
                  handlePinClick={handlePinClick}
                  handleSelectedNotes={handleSelectedNotes}
                  selectedNotes={selectedNotes}
                  openDeleteDialog={openDeleteDialog}
                />
              ))}
          </div>
        </>
      )}
      <div className="notes-grid">
        {notes
          .filter((note: any) => !activeNote || note.id !== activeNote.id)
          .filter((note: any) => !note.isPinned)
          .map((note: any) => (
            <InactiveNote
              key={`note-${note.id}`}
              note={note}
              setActiveNote={setActiveNote}
              hoveredNote={hoveredNote}
              setHoveredNote={setHoveredNote}
              handlePinClick={handlePinClick}
              handleSelectedNotes={handleSelectedNotes}
              selectedNotes={selectedNotes}
              openDeleteDialog={openDeleteDialog}
            />
          ))}
      </div>
      <dialog id="delete" className="modal" ref={deleteDialogRef}>
        <form method="dialog" className="modal-box">
          <h3 className="text-lg font-bold text-center">Are you sure you'd like to delete this note?</h3>
          <p className="py-4 text-center">This action cannot be undone!</p>
          <div className="flex items-center justify-center modal-action">
            <button className="btn btn-primary" onClick={()=>deleteDialogRef.current?.close()}>Cancel</button>
            <button className="btn btn-error" onClick={confirmDelete}>Delete</button>
          </div>
        </form>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default NotesContent;
