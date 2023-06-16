interface NotesSideBarProps {
  activeTab: string;
  notes: any;
  activeNote: any;
  setActiveNote: any;
}

const NotesSideBar = ({
  activeTab,
  notes,
  activeNote,
  setActiveNote,
}: NotesSideBarProps) => {
  return (
    <div className="flex flex-col w-3/10 items-center bg-base-300 text-secondary h-full relative z-10">
      {activeTab === "notebook" && (
        <>
          {notes &&
            notes.map((note: any) => (
              <div
                key={`tab-${note.id}`}
                className={
                  activeNote?.id === note.id
                    ? "button-badge_active"
                    : "button-badge"
                }
                onClick={() => setActiveNote?.(note)}
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
