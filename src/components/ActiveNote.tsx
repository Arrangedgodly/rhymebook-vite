import {
  UserPlusIcon,
  ArrowsPointingInIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

interface ActiveNoteProps {
  activeNote: any;
  setActiveNote: any;
  handleNoteSave: any;
}

const ActiveNote = ({ activeNote, setActiveNote, handleNoteSave }: ActiveNoteProps) => {
  const [editing, setEditing] = useState({ title: false, lyrics: false });
  const [updatedNote, setUpdatedNote] = useState(activeNote);

  const updateNote = () => {
    handleNoteSave(updatedNote, activeNote.id)
  }

  const handleDoubleClick = (section: string) => {
    setEditing({ ...editing, [section]: true });
  };

  const handleBlur = () => {
    setEditing({ title: false, lyrics: false });
    updateNote();
  };

  const handleChange = (section: string, value: string) => {
    setUpdatedNote({ ...updatedNote, [section]: value });
  };

  const navigate = useNavigate();

  useEffect(() => {
    setUpdatedNote(activeNote);
  }, [activeNote]);
  
  return (
    <div className="active-note" key={`note-${activeNote.id}`}>
      {editing.title ? (
        <input
          value={updatedNote.title}
          onChange={(e) => handleChange("title", e.target.value)}
          onBlur={handleBlur}
          className="text-note-title_input"
          autoFocus
        />
      ) : (
        <h3 className="text-note-title" onDoubleClick={() => handleDoubleClick("title")}>
          {updatedNote.title}
        </h3>
      )}
      {editing.lyrics ? (
        <textarea
          value={updatedNote.lyrics}
          onChange={(e) => handleChange("lyrics", e.target.value)}
          onBlur={handleBlur}
          autoFocus
          className="text-note-body"
        />
      ) : (
        <textarea className="text-note-body" readOnly onDoubleClick={() => handleDoubleClick("lyrics")} value={updatedNote.lyrics} />
      )}
      <div className="container-notebuttons">
        <UserPlusIcon className="text-icon" />
        <ArrowsPointingInIcon
          className="text-icon"
          onClick={() => setActiveNote?.(null)}
        />
        <PencilSquareIcon
          className="text-icon"
          onClick={() => navigate(`/notes/${activeNote.id}`)}
        />
        <TrashIcon className="text-icon" />
      </div>
    </div>
  );
};

export default ActiveNote;
