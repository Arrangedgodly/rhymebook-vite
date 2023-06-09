import { getDefinition } from "../utils/dictionaryApi";
import { useEffect, useState, MouseEvent } from "react";
import SuggestedSection from "./SuggestedSection";

interface SuggestedProps {
  rhymes: string[];
  soundAlikes: string[];
  nouns: string[];
  adjectives: string[];
  synonyms: string[];
  antonyms: string[];
  frequentFollowers: string[];
  relatedWords: string[];
}

const Suggested = ({
  rhymes,
  soundAlikes,
  nouns,
  adjectives,
  synonyms,
  antonyms,
  frequentFollowers,
  relatedWords,
}: SuggestedProps) => {
  const [partsOfSpeech, setPartsOfSpeech] = useState<string[]>([]);
  const [definitions, setDefinitions] = useState<string[]>([]);

  const handleDefinitions = async (word: string) => {
    getDefinition(word).then((res) => {
      let def = [];
      let pos = [];
      const resData = res[0];
      for (let i = 0; i < resData.length; i++) {
        def.push(resData[i].definition);
        pos.push(resData[i].partOfSpeech);
      }
      setDefinitions(def);
      setPartsOfSpeech(pos);
    })
  }

  const handleRightClick = (e: MouseEvent, word: string) => {
    e.preventDefault();
    handleDefinitions(word);
  }

  return (
    <div className="flex flex-col justify-around items-center w-1/2 h-[70vh] my-auto m-5 bg-accent text-accent-content rounded-2xl">
      {rhymes.length > 0 && (
        <SuggestedSection
          title="Rhymes"
          words={rhymes}
          handleRightClick={handleRightClick}
        />
      )}
      {soundAlikes.length > 0 && (
        <SuggestedSection
          title="Sound Alikes"
          words={soundAlikes}
          handleRightClick={handleRightClick}
        />
      )}
      {nouns.length > 0 && (
        <SuggestedSection
          title="Nouns"
          words={nouns}
          handleRightClick={handleRightClick}
        />
      )}
      {adjectives.length > 0 && (
        <SuggestedSection
          title="Adjectives"
          words={adjectives}
          handleRightClick={handleRightClick}
        />
      )}
      {synonyms.length > 0 && (
        <SuggestedSection
          title="Synonyms"
          words={synonyms}
          handleRightClick={handleRightClick}
        />
      )}
      {antonyms.length > 0 && (
        <SuggestedSection
          title="Antonyms"
          words={antonyms}
          handleRightClick={handleRightClick}
        />
      )}
      {frequentFollowers.length > 0 && (
        <SuggestedSection
          title="Frequent Followers"
          words={frequentFollowers}
          handleRightClick={handleRightClick}
        />
      )}
      {relatedWords.length > 0 && (
        <SuggestedSection
          title="Related Words"
          words={relatedWords}
          handleRightClick={handleRightClick}
        />
      )}
    </div>
  );
};

export default Suggested;
