interface NotesSideBarProps {
  notes: any;
  activeNote: any;
  setActiveNote: any;
}

const NotesSideBar = ({
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
    <div className="drawer w-auto text-secondary z-10">
      <input id="notebook-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-side">
        <label htmlFor="notebook-drawer" className="drawer-overlay"></label>
        <ul className="menu p-4 h-full bg-base-200 items-center justify-center text-base-content">
        {notes &&
            notes.map((note: any) => (
              <li
                key={`tab-${note.id}`}
                className={
                  activeNote?.id === note.id
                    ? "button-badge_active"
                    : "button-badge"
                }
                onClick={() => handleBadgeClick(note)}
              >
                <h1 className="text-md font-bold w-[90%] truncate text-ellipsis">{note.title}</h1>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default NotesSideBar;
