interface NotesContentProps {
  notes: any;
  activeNote: any;
}

const NotesContent = ({ notes, activeNote }: NotesContentProps) => {
  return (
    <div className="container-notes-content">
      {notes.map((note: any) => (
          <div
            className="container-note bg-secondary text-secondary-content"
            key={`note-${note.id}`}
          >
            <h3 className="font-bold text-xl truncate overflow-hidden w-[80%] text-center">{note.title}</h3>
            <textarea className="text-base text-ellipsis overflow-hidden w-full h-full m-auto text-center p-5 bg-secondary text-secondary-content" readOnly>{note.lyrics}</textarea>
          </div>
        ))}
    </div>
  );
};

export default NotesContent;
