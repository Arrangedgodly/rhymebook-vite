import { useState, useEffect, useRef } from "react";
import ActiveNote from "./ActiveNote";
import InactiveNote from "./InactiveNote";

interface NotesContentProps {
  notes: any;
  activeNote: any;
  setActiveNote: any;
}

const NotesContent = ({
  notes,
  activeNote,
  setActiveNote,
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
      {notes
        .filter((note: any) => !activeNote || note.id !== activeNote.id)
        .map((note: any) => (
          <InactiveNote
            key={`note-${note.id}`}
            note={note}
            setActiveNote={setActiveNote}
            hoveredNote={hoveredNote}
            setHoveredNote={setHoveredNote}
          />
        ))}
    </div>
  );
};

export default NotesContent;
