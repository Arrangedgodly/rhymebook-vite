import { useState, useEffect, KeyboardEvent } from "react";

interface DashboardProps {
  currentUser: any;
}

const Dashboard = ({ currentUser }: DashboardProps) => {
  const [title, setTitle] = useState<string>("");
  const [lyrics, setLyrics] = useState<string>("");
  const [themes, setThemes] = useState<string>("");
  const [lastWord, setLastWord] = useState<string>("");

  const getLastWord = (str: string) => {
    const words = str.split(" ");
    return words[words.length - 1];
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === ' ' || e.key === 'Enter') {
      setLastWord(getLastWord(lyrics));
    }
  };

  useEffect(() => {
    console.log(lastWord);
  }, [lastWord]);

  return (
    <div className="flex flex-col flex-grow items-center justify-center w-screen">
      <div className="flex flex-row space-around w-full">
        <div className="flex flex-col items-center w-1/2 m-2">
          <div className="form-control w-3/4">
            <label className="label">
              <span className="label-text text-xl text-primary-content">
                Title
              </span>
            </label>
            <input
              type="text"
              placeholder="Title"
              className="input input-bordered text-primary-content bg-primary text-center placeholder-primary-content text-lg"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="form-control w-3/4">
            <label className="label">
              <span className="label-text text-xl text-primary-content">
                Lyrics
              </span>
            </label>
            <textarea
              placeholder="Lyrics"
              className="textarea textarea-bordered text-primary-content bg-primary text-center placeholder-primary-content h-96 text-lg"
              value={lyrics}
              onChange={(e) => setLyrics(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="form-control w-3/4">
            <label className="label">
              <span className="label-text text-xl text-primary-content">
                Themes
              </span>
            </label>
            <input
              type="text"
              placeholder="Themes"
              className="input input-bordered text-primary-content bg-primary text-center placeholder-primary-content text-lg"
              value={themes}
              onChange={(e) => setThemes(e.target.value)}
            />
            <label className="label">
              <span className="label-text-alt"></span>
              <span className="label-text-alt text-lg italic text-primary-content">
                Seperate themes with spaces or commas!
              </span>
            </label>
          </div>
        </div>
      </div>
      <ul className="menu bg-base-200 menu-horizontal m-2 text-primary">
        <div
          className={currentUser ? "tooltip tooltip-primary tooltip-bottom" : "tooltip tooltip-error tooltip-bottom"}
          data-tip={currentUser ? "Notes automatically save every minute" : "You must be logged in to save notes!"}
        >
          <li className={currentUser ? "" : "disabled"}>
            <a>Save</a>
          </li>
        </div>
        <li>
          <a>Reset</a>
        </li>
      </ul>
    </div>
  );
};

export default Dashboard;
