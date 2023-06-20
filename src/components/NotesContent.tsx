import { useState, useEffect, useRef } from "react";
import ActiveNote from "./ActiveNote";
import InactiveNote from "./InactiveNote";

interface NotesContentProps {
  notes: any;
  activeNote: any;
  setActiveNote: any;
  handlePinClick: any;
  pinnedNotes: any;
  handleSelectedNotes: any;
  selectedNotes: string[];
}

const NotesContent = ({
  notes,
  activeNote,
  setActiveNote,
  handlePinClick,
  pinnedNotes,
  handleSelectedNotes,
  selectedNotes,
}: NotesContentProps) => {
  const [hoveredNote, setHoveredNote] = useState(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
        <ActiveNote activeNote={activeNote} setActiveNote={setActiveNote} />
      )}
      {pinnedNotes.length > 0 && (
        <>
          <h3 className="text-note-title">Pinned Notes</h3>
          <div className="w-full flex items-center justify-center">
            {pinnedNotes
              .filter((note: any) => !activeNote || note.id !== activeNote.id)
              .map((note: any) => (
                <InactiveNote
                  key={`note-${note.id}`}
                  note={note}
                  setActiveNote={setActiveNote}
                  hoveredNote={hoveredNote}
                  setHoveredNote={setHoveredNote}
                  handlePinClick={handlePinClick}
                  pinnedNotes={pinnedNotes}
                  handleSelectedNotes={handleSelectedNotes}
                  selectedNotes={selectedNotes}
                />
              ))}
          </div>
        </>
      )}
      {notes
        .filter((note: any) => !activeNote || note.id !== activeNote.id)
        .map((note: any) => (
          <InactiveNote
            key={`note-${note.id}`}
            note={note}
            setActiveNote={setActiveNote}
            hoveredNote={hoveredNote}
            setHoveredNote={setHoveredNote}
            handlePinClick={handlePinClick}
            pinnedNotes={pinnedNotes}
            handleSelectedNotes={handleSelectedNotes}
            selectedNotes={selectedNotes}
          />
        ))}
    </div>
  );
};

export default NotesContent;
