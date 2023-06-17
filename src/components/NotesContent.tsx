interface NotesContentProps {
  activeNote: any;
}

const NotesContent = ({ activeNote }: NotesContentProps) => {
  return (
    <div className="flex flex-col flex-grow items-center justify-center h-full relative z-0">
      {activeNote ? (
        <div className="container-notecard">
          <h2 className="card-title m-5 text-2xl mx-auto">
            {activeNote.title}
          </h2>
          <div className="container-notebody">
            <textarea
              className="textarea textarea-ghost text-center text-lg min-h-full px-5 bg-secondary text-secondary-content"
              value={activeNote.lyrics}
              readOnly
            ></textarea>
          </div>
        </div>
      ) : (
        <div className="card"></div>
      )}
    </div>
  );
};

export default NotesContent;
