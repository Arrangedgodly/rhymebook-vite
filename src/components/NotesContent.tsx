import {
  UserPlusIcon,
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
  EllipsisVerticalIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { useState } from "react";

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
  return (
    <div className="container-notes-content">
      {activeNote && (
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
          <div className="absolute bottom-0 left-0 right-0 flex justify-evenly p-2 bg-gray-100">
            <UserPlusIcon className="h-6 w-6 text-gray-500 cursor-pointer" />
            <ArrowsPointingInIcon className="h-6 w-6 text-gray-500 cursor-pointer" />
            <EllipsisVerticalIcon className="h-6 w-6 text-gray-500 cursor-pointer" />
            <TrashIcon className="h-6 w-6 text-gray-500 cursor-pointer" />
          </div>
        </div>
      )}
      {notes
        .filter((note: any) => !activeNote || note.id !== activeNote.id)
        .map((note: any) => (
          <div
            className="container-note bg-secondary text-secondary-content relative"
            key={`note-${note.id}`}
            onMouseEnter={() => setHoveredNote(note.id)}
            onMouseLeave={() => setHoveredNote(null)}
            onClick={() => setActiveNote?.(note)}
          >
            <h3 className="font-bold text-xl truncate overflow-hidden w-[80%] text-center">
              {note.title}
            </h3>
            <textarea
              className="text-base text-ellipsis overflow-hidden w-full h-full m-auto text-center p-5 bg-secondary text-secondary-content overflow-y-auto"
              readOnly
              value={note.content}
            />

            {hoveredNote === note.id && (
              <div className="absolute bottom-0 left-0 right-0 flex justify-evenly p-2 bg-gray-100">
                <UserPlusIcon className="h-6 w-6 text-gray-500 cursor-pointer" />
                <ArrowsPointingOutIcon className="h-6 w-6 text-gray-500 cursor-pointer" />
                <EllipsisVerticalIcon className="h-6 w-6 text-gray-500 cursor-pointer" />
                <TrashIcon className="h-6 w-6 text-gray-500 cursor-pointer" />
              </div>
            )}
          </div>
        ))}
    </div>
  );
};

export default NotesContent;
