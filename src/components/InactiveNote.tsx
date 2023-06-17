import {
  UserPlusIcon,
  ArrowsPointingOutIcon,
  EllipsisVerticalIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";

interface InactiveNoteProps {
  note: any;
  setActiveNote: any;
  hoveredNote: any;
  setHoveredNote: any;
}

const InactiveNote = ({ note, setActiveNote, hoveredNote, setHoveredNote }: InactiveNoteProps) => {
  return (
    <div
      className="container-note bg-secondary text-secondary-content relative"
      onMouseEnter={() => setHoveredNote(note.id)}
      onMouseLeave={() => setHoveredNote(null)}
      onClick={() => setActiveNote?.(note)}
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
        <div className="absolute bottom-0 left-0 right-0 flex justify-evenly p-2 bg-base-200">
          <UserPlusIcon className="h-6 w-6 text-accent cursor-pointer" />
          <ArrowsPointingOutIcon className="h-6 w-6 text-accent cursor-pointer" />
          <EllipsisVerticalIcon className="h-6 w-6 text-accent cursor-pointer" />
          <TrashIcon className="h-6 w-6 text-accent cursor-pointer" />
        </div>
      )}
    </div>
  );
};

export default InactiveNote;
