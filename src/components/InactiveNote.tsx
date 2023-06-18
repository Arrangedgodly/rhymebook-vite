import {
  UserPlusIcon,
  ArrowsPointingOutIcon,
  TrashIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/solid";
import { AiOutlineCheckCircle, AiFillCheckCircle } from "react-icons/ai";
import { MdPushPin, MdOutlinePushPin } from "react-icons/md";

interface InactiveNoteProps {
  note: any;
  setActiveNote: any;
  hoveredNote: any;
  setHoveredNote: any;
  handlePinClick: any;
}

const InactiveNote = ({
  note,
  setActiveNote,
  hoveredNote,
  setHoveredNote,
  handlePinClick,
}: InactiveNoteProps) => {
  return (
    <div
      className="container-note bg-secondary text-secondary-content relative"
      onMouseEnter={() => setHoveredNote(note.id)}
      onMouseLeave={() => setHoveredNote(null)}
    >
      <h3 className="font-bold text-xl truncate overflow-hidden w-[90%] text-center m-2">
        {note.title}
      </h3>
      <textarea
        className="text-base text-ellipsis overflow-hidden w-full h-full m-auto text-center p-5 bg-secondary text-secondary-content overflow-y-auto"
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
          <PencilSquareIcon className="text-icon" />
          <TrashIcon className="text-icon" />
        </div>
      )}
      {hoveredNote === note.id && (
        <div className="container-noteselect">
          <AiOutlineCheckCircle className="text-icon_alt" />
        </div>
      )}
      {hoveredNote === note.id && (
        <div className="container-notepin" onClick={() => handlePinClick(note.id, note.isPinned)}>
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
