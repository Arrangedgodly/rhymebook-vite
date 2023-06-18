import {
  UserPlusIcon,
  ArrowsPointingInIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";

interface ActiveNoteProps {
  activeNote: any;
  setActiveNote: any;
}

const ActiveNote = ({ activeNote, setActiveNote }: ActiveNoteProps) => {
  const navigate = useNavigate();
  return (
    <div
      className="active-note"
      key={`note-${activeNote.id}`}
    >
      <h3 className="text-note-title">
        {activeNote.title}
      </h3>
      <textarea
        className="text-note-body"
        readOnly
        value={activeNote.lyrics}
      />
      <div className="container-notebuttons">
        <UserPlusIcon className="text-icon" />
        <ArrowsPointingInIcon
          className="text-icon"
          onClick={() => setActiveNote?.(null)}
        />
        <PencilSquareIcon className="text-icon" onClick={() => navigate(`/notes/${activeNote.id}`)}/>
        <TrashIcon className="text-icon" />
      </div>
    </div>
  );
};

export default ActiveNote;
