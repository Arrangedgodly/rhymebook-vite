interface NotesSideBarProps {
  activeTab: string;
  notes: any;
  activeNote: any;
  setActiveNote: any;
}

const NotesSideBar = ({ activeTab, notes, activeNote, setActiveNote }: NotesSideBarProps) => {
  return (
    <div className="flex flex-col w-3/10 items-center bg-base-300 text-secondary h-full relative z-10">
      {activeTab === "notebook" && (
        <>
          {notes &&
            notes.map((note: any) => (
              <div
                key={`tab-${note.id}`}
                className="badge badge-outline badge-lg hover:bg-accent hover:text-accent-content m-5 w-4/5 h-10"
              >
                <h1 className="text-lg font-bold truncate">{note.title}</h1>
              </div>
            ))}
        </>
      )}
    </div>
  );
};

export default NotesSideBar;
