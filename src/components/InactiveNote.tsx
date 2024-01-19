import {
  UserPlusIcon,
  ArrowsPointingOutIcon,
  TrashIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/solid";
import { AiOutlineCheckCircle, AiFillCheckCircle } from "react-icons/ai";
import { MdPushPin, MdOutlinePushPin } from "react-icons/md";
import { useNavigate } from "react-router-dom";

interface InactiveNoteProps {
  note: any;
  setActiveNote: any;
  hoveredNote: any;
  setHoveredNote: any;
  handlePinClick: any;
  handleSelectedNotes: any;
  selectedNotes: string[];
  openDeleteDialog: any;
}

const InactiveNote = ({
  note,
  setActiveNote,
  hoveredNote,
  setHoveredNote,
  handlePinClick,
  handleSelectedNotes,
  selectedNotes,
  openDeleteDialog,
}: InactiveNoteProps) => {
  const navigate = useNavigate();
  return (
    <div
      className={
        selectedNotes.includes(note.id)
          ? "container-note container-note_selected border-white shadow-2xl"
          : "container-note"
      }
      onMouseEnter={() => setHoveredNote(note.id)}
      onMouseLeave={() => setHoveredNote(null)}
    >
      <h3 className="font-bold text-md truncate overflow-hidden w-[90%] text-center m-2">
        {note.title}
      </h3>
      <textarea
        className="w-full h-full p-2 m-auto overflow-hidden overflow-y-auto text-xs text-center container-note-textarea text-ellipsis bg-secondary text-secondary-content"
        readOnly
        value={note.lyrics}
      />

      {hoveredNote === note.id && (
        <div className="container-notebuttons">
          <UserPlusIcon className="text-icon" />
          <ArrowsPointingOutIcon
            className="text-icon"
            onClick={() => setActiveNote?.(note)}
          />
          <PencilSquareIcon
            className="text-icon"
            onClick={() => navigate(`/notes/${note.id}`)}
          />
          <TrashIcon
            className="text-icon"
            onClick={() => openDeleteDialog(note.id)}
          />
        </div>
      )}
      {(hoveredNote === note.id || selectedNotes.includes(note.id)) && (
        <div
          className="container-noteselect"
          onClick={() => handleSelectedNotes(note.id)}
        >
          {selectedNotes.includes(note.id) ? (
            <AiFillCheckCircle className="text-icon_alt" />
          ) : (
            <AiOutlineCheckCircle className="text-icon_alt" />
          )}
        </div>
      )}
      {(hoveredNote === note.id || note.isPinned) && (
        <div
          className="container-notepin"
          onClick={() => handlePinClick(note.id, note.isPinned)}
        >
          {note.isPinned ? (
            <MdPushPin className="text-icon_alt" />
          ) : (
            <MdOutlinePushPin className="text-icon_alt" />
          )}
        </div>
      )}
    </div>
  );
};

export default InactiveNote;
