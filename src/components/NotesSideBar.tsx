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
  /**
   * This function handles a click event on a badge and toggles the active note based on its ID.
   * @param {any} note - The `note` parameter is of type `any` and is used as an argument in the
   * `handleBadgeClick` function. It is likely an object that represents a note in an application.
   */
  const handleBadgeClick = (note: any) => {
    if (activeNote?.id === note.id) {
      setActiveNote?.(null);
    } else {
      setActiveNote?.(note);
    }
  };

  return (
    <div className="flex flex-col w-1/6 items-center bg-base-300 text-secondary h-full relative z-10">
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
                onClick={() => handleBadgeClick(note)}
              >
                <h1 className="text-md font-bold truncate">{note.title}</h1>
              </div>
            ))}
        </>
      )}
    </div>
  );
};

export default NotesSideBar;
