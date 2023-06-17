import {
  UserPlusIcon,
  ArrowsPointingInIcon,
  EllipsisVerticalIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";

interface ActiveNoteProps {
  activeNote: any;
  setActiveNote: any;
}

const ActiveNote = ({ activeNote, setActiveNote }: ActiveNoteProps) => {
  return (
    <div
      className="container-note bg-secondary text-secondary-content active-note"
      key={`note-${activeNote.id}`}
    >
      <h3 className="font-bold text-xl truncate overflow-hidden w-[80%] text-center">
        {activeNote.title}
      </h3>
      <textarea
        className="text-base text-ellipsis overflow-hidden w-full h-full m-auto text-center p-5 bg-secondary text-secondary-content overflow-y-auto"
        readOnly
        value={activeNote.lyrics}
      />
      <div className="absolute bottom-0 left-0 right-0 flex justify-evenly p-2 bg-base-200">
        <UserPlusIcon className="h-6 w-6 text-accent cursor-pointer" />
        <ArrowsPointingInIcon
          className="h-6 w-6 text-accent cursor-pointer"
          onClick={() => setActiveNote?.(null)}
        />
        <EllipsisVerticalIcon className="h-6 w-6 text-accent cursor-pointer" />
        <TrashIcon className="h-6 w-6 text-accent cursor-pointer" />
      </div>
    </div>
  );
};

export default ActiveNote;
