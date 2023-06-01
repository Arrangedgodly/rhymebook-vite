import { TxtAnime } from "txtanime.js";
import { useEffect } from "react";

const Landing = () => {
  useEffect(() => {
    new TxtAnime(".typing", {
      effect: "txt-an-7",
      delayStart: 0,
      delay: 0.05,
      duration: 0.07,
      repeat: true,
      text: ["Can't stop writing", "Keep the flow going", "Always undefeated"],
    });
  }, []);

  useEffect(() => {
    new TxtAnime(".rhymes", {
      effect: "txt-an-4",
      delayStart: 0,
      delay: 2,
      duration: 1.00,
      repeat: true,
      text: [
        "exciting lighting fighting biting whiting sighting inciting handwriting underwriting citing",
        "owing knowing hoeing sewing boeing showing rowing bowing sowing towing",
        "conceited depleted defeated completed treated repeated seated heated greeted",
      ],
    });
  }, []);

  return (
    <div className="flex flex-col flex-grow items-center justify-center">
      <h1 className="text-5xl text-center text-primary-content m-4">
        Welcome to RhymePage!
      </h1>
      <h2 className="text-3xl text-center text-primary-content m-2">
        An API powered lyric writing application that writes your rhymes with
        you.
      </h2>
      <div className="card bg-secondary text-secondary-content m-4">
        <p className="text-2xl text-center text-secondary-content m-2 typing"></p>
      </div>
      <div className="card bg-accent text-accent-content flex flex-row items-center m-4">
        <div className="flex flex-col items-center m-4 gap-4">
          <h3 className="text-lg">Rhymes</h3>
          <p className="text-sm text-center text-accent-content rhymes"></p>
        </div>
        <div className="flex flex-col items-center justify-center m-4 gap-4">
          <h3 className="text-lg">Sound-Alikes</h3>
          <p className="text-sm text-center text-accent-content soundalikes"></p>
        </div>
        <div className="flex flex-col items-center justify-center m-4 gap-4">
          <h3 className="text-lg">Synonyms</h3>
          <p className="text-sm text-center text-accent-content synonyms"></p>
        </div>
        <div className="flex flex-col items-center justify-center m-4 gap-4">
          <h3 className="text-lg">Antonyms</h3>
          <p className="text-sm text-center text-accent-content antonyms"></p>
        </div>
        <div className="flex flex-col items-center justify-center m-4 gap-4">
          <h3 className="text-lg">Adjectives</h3>
          <p className="text-sm text-center text-accent-content adjectives"></p>
        </div>
        <div className="flex flex-col items-center justify-center m-4 gap-4">
          <h3 className="text-lg">Frequent Followers</h3>
          <p className="text-sm text-center text-accent-content freqfollowers"></p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
