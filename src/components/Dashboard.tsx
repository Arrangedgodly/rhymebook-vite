import useDashboardLogic from "../hooks/useDashboardLogic";
import Definitions from "./Definitions";
import Suggested from "./Suggested";
import { useParams } from "react-router-dom";

interface DashboardProps {
  currentUser: any;
}

const Dashboard = ({ currentUser }: DashboardProps) => {
  const { existingNoteId } = useParams<{ existingNoteId?: string }>();
  const {
    title,
    setTitle,
    lyrics,
    setLyrics,
    themes,
    setThemes,
    rhymes,
    soundAlikes,
    nouns,
    adjectives,
    synonyms,
    antonyms,
    frequentFollowers,
    relatedWords,
    handleSave,
    handleReset,
    handleLeftClick,
    setDefinitions,
    definitions,
    handleKeyDown,
  } = useDashboardLogic({ currentUser, existingNoteId });

  return (
    <div className="container-main">
      <div className="flex md:flex-row flex-col space-around w-screen">
        <Definitions definitions={definitions} />
        <div className="flex flex-col items-center md:w-3/5 w-screen md:m-5">
          <div className="form-control w-[90%] max-w-[750px]">
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
          <div className="form-control w-[90%] max-w-[750px]">
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
          <div className="form-control w-[90%] max-w-[750px]">
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
              <span className="label-text-alt text-sm italic text-primary-content md:block hidden">
                Seperate themes with spaces or commas!
              </span>
            </label>
          </div>
        </div>
        <Suggested
          rhymes={rhymes}
          soundAlikes={soundAlikes}
          nouns={nouns}
          adjectives={adjectives}
          synonyms={synonyms}
          antonyms={antonyms}
          frequentFollowers={frequentFollowers}
          relatedWords={relatedWords}
          handleLeftClick={handleLeftClick}
          setDefinitions={setDefinitions}
        />
      </div>
      <ul className="menu bg-base-200 menu-horizontal m-2 text-primary">
        <div
          className={
            currentUser
              ? "tooltip tooltip-primary tooltip-bottom"
              : "tooltip tooltip-error tooltip-bottom"
          }
          data-tip={
            currentUser
              ? "Once you save a note to your collection, it will automatically save every time you type!"
              : "You must be logged in to save notes!"
          }
        >
          <li className={currentUser ? "" : "disabled"}>
            <a onClick={handleSave}>Save</a>
          </li>
        </div>
        <li>
          <a onClick={handleReset}>Reset</a>
        </li>
      </ul>
    </div>
  );
};

export default Dashboard;
