interface NotesContentProps {
  activeNote: any;
}

const NotesContent = ({activeNote}: NotesContentProps) => {
  return (
    <div className="flex flex-col w-6/10 items-center h-full relative z-0">
      {activeNote ? (<div className='card w-500 bg-base-300 shadow-xl m-10'>
        <h2 className='card-title m-5'>{activeNote.title}</h2>
        <div className='card-body'>
          <p className='text-base-content'>{activeNote.lyrics}</p>
        </div>
      </div>) : (<div className='card'></div>)}
    </div>
  )
}

export default NotesContent;