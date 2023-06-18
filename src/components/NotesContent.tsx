import { useState, useEffect, useRef } from "react";
import ActiveNote from "./ActiveNote";
import InactiveNote from "./InactiveNote";

interface NotesContentProps {
  notes: any;
  activeNote: any;
  setActiveNote: any;
  handlePinClick: any;
  pinnedNotes: any;
}

const NotesContent = ({
  notes,
  activeNote,
  setActiveNote,
  handlePinClick,
  pinnedNotes,
}: NotesContentProps) => {
  const [hoveredNote, setHoveredNote] = useState(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
          />
        ))}
    </div>
  );
};

export default NotesContent;
