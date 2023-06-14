import { useState, useEffect, KeyboardEvent } from "react";
import {
  getRhyme,
  getSoundAlike,
  getRelatedAdjectives,
  getRelatedNouns,
  getRelatedWords,
  getSynonyms,
  getAntonyms,
  getFrequentFollowers
} from "../utils/rhymeApi";
import Suggested from "./Suggested";

interface DashboardProps {
  currentUser: any;
}

const Dashboard = ({ currentUser }: DashboardProps) => {
  const [title, setTitle] = useState<string>("");
  const [lyrics, setLyrics] = useState<string>("");
  const [themes, setThemes] = useState<string>("");
  const [lastWord, setLastWord] = useState<string>("");
  const [rhymes, setRhymes] = useState<string[]>([]);
  const [soundAlikes, setSoundAlikes] = useState<string[]>([]);
  const [nouns, setNouns] = useState<string[]>([]);
  const [adjectives, setAdjectives] = useState<string[]>([]);
  const [synonyms, setSynonyms] = useState<string[]>([]);
  const [antonyms, setAntonyms] = useState<string[]>([]);
  const [frequentFollowers, setFrequentFollowers] = useState<string[]>([]);
  const [relatedWords, setRelatedWords] = useState<string[]>([]);

  const handleReset = () => {
    setTitle("");
    setLyrics("");
    setThemes("");
    setLastWord("");
    setRhymes([]);
    setSoundAlikes([]);
    setNouns([]);
    setAdjectives([]);
    setSynonyms([]);
    setAntonyms([]);
    setFrequentFollowers([]);
    setRelatedWords([]);
  }

  const getLastWord = (str: string) => {
    const words = str.split(" ");
    return words[words.length - 1];
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === " " || e.key === "Enter") {
      setLastWord(getLastWord(lyrics));
    }
  };

  const handleLeftClick = (word: string) => {
    setLyrics(lyrics + word + " ");
    setLastWord(word);
  };

  const getRhymes = async () => {
    const res = await getRhyme(lastWord, 'topic', themes, 50);
    let values = [];
    for (let i = 0; i < res.length; i++) {
      values.push(res[i].word);
    }
    setRhymes(values);
  };

  const getSoundAlikes = async () => {
    const res = await getSoundAlike(lastWord, 'topic', themes, 50);
    let values = [];
    for (let i = 0; i < res.length; i++) {
      values.push(res[i].word);
    }
    setSoundAlikes(values);
  };

  const getNouns = async () => {
    const res = await getRelatedNouns(lastWord, 'topic', themes, 50);
    let values = [];
    for (let i = 0; i < res.length; i++) {
      values.push(res[i].word);
    }
    setNouns(values);
  };

  const getAdjs = async () => {
    const res = await getRelatedAdjectives(lastWord, 'topic', themes, 50);
    let values = [];
    for (let i = 0; i < res.length; i++) {
      values.push(res[i].word);
    }
    setAdjectives(values);
  };

  const getSyns = async () => {
    const res = await getSynonyms(lastWord, 'topic', themes, 50);
    let values = [];
    for (let i = 0; i < res.length; i++) {
      values.push(res[i].word);
    }
    setSynonyms(values);
  };

  const getAnts = async () => {
    const res = await getAntonyms(lastWord, 'topic', themes, 50);
    let values = [];
    for (let i = 0; i < res.length; i++) {
      values.push(res[i].word);
    }
    setAntonyms(values);
  };

  const getFreqFollowers = async () => {
    const res = await getFrequentFollowers(lastWord, 'topic', themes, 50);
    let values = [];
    for (let i = 0; i < res.length; i++) {
      values.push(res[i].word);
    }
    setFrequentFollowers(values);
  };

  const getRelWords = async () => {
    const res = await getRelatedWords(lastWord, 'topic', themes, 50);
    let values = [];
    for (let i = 0; i < res.length; i++) {
      values.push(res[i].word);
    }
    setRelatedWords(values);
  };

  useEffect(() => {
    getRhymes();
    getSoundAlikes();
    getNouns();
    getAdjs();
    getSyns();
    getAnts();
    getFreqFollowers();
    getRelWords();
  }, [lastWord]);

  return (
    <div className="container-main">
      <div className="flex flex-row space-around w-full">
        <div className="flex flex-col items-center w-1/5 m-5">
        </div>
        <div className="flex flex-col items-center w-3/5 m-5">
          <div className="form-control w-1/2">
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
          <div className="form-control w-2/3">
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
          <div className="form-control w-1/2">
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
            <a>Save</a>
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
