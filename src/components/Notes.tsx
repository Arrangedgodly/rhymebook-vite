import { BookOpenIcon, TagIcon, PencilSquareIcon } from "@heroicons/react/24/solid";

interface NotesProps {
  currentUser: any;
}

const Notes = ({ currentUser }: NotesProps) => {
  return (
    <div className="container-notes">
      <div className="flex flex-col w-1/10 items-center bg-accent h-full relative z-10">
        <button className="btn btn-md btn-accent m-2">
          <BookOpenIcon className="w-8 h-8 text-accent-content" />
        </button>
        <button className="btn btn-md btn-accent m-2">
          <TagIcon className="w-8 h-8 text-accent-content" />
        </button>
        <button className="btn btn-md btn-accent m-2 mt-auto">
          <PencilSquareIcon className="w-8 h-8 text-accent-content" />
        </button>
      </div>
      <div className='flex flex-col w-3/10 items-center bg-primary h-full relative z-10'>
      </div>
      <div className='flex flex-col w-6/10 items-center h-full relative z-0'>
      </div>
    </div>
  );
};

export default Notes;
