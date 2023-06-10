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
  handleLeftClick: (word: string) => void;
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
  handleLeftClick,
}: SuggestedProps) => {
  const [partsOfSpeech, setPartsOfSpeech] = useState<string[]>([]);
  const [definitions, setDefinitions] = useState<string[]>([]);

  const handleDictionary = async (word: string) => {
    getDefinition(word).then((res) => {
      let def = [];
      let pos = [];
      const resData = res[0].meanings;
      for (let i = 0; i < resData.length; i++) {
        pos.push(resData[i].partOfSpeech);
        for (let j = 0; j < resData[i].definitions.length; j++) {
          def.push(resData[i].definitions[j].definition);
        }
      }
      setDefinitions(def);
      setPartsOfSpeech(pos);
    })
  }

  const handleRightClick = (e: MouseEvent, word: string) => {
    e.preventDefault();
    handleDictionary(word);
  }

  return (
    <div className="flex flex-col justify-start items-center w-1/5 my-auto m-5 max-h-[70vh] overflow-y-auto">
      {rhymes.length > 0 && (
        <SuggestedSection
          title="Rhymes"
          words={rhymes}
          handleRightClick={handleRightClick}
          handleLeftClick={handleLeftClick}
        />
      )}
      {soundAlikes.length > 0 && (
        <SuggestedSection
          title="Sound Alikes"
          words={soundAlikes}
          handleRightClick={handleRightClick}
          handleLeftClick={handleLeftClick}
        />
      )}
      {nouns.length > 0 && (
        <SuggestedSection
          title="Nouns"
          words={nouns}
          handleRightClick={handleRightClick}
          handleLeftClick={handleLeftClick}
        />
      )}
      {adjectives.length > 0 && (
        <SuggestedSection
          title="Adjectives"
          words={adjectives}
          handleRightClick={handleRightClick}
          handleLeftClick={handleLeftClick}
        />
      )}
      {synonyms.length > 0 && (
        <SuggestedSection
          title="Synonyms"
          words={synonyms}
          handleRightClick={handleRightClick}
          handleLeftClick={handleLeftClick}
        />
      )}
      {antonyms.length > 0 && (
        <SuggestedSection
          title="Antonyms"
          words={antonyms}
          handleRightClick={handleRightClick}
          handleLeftClick={handleLeftClick}
        />
      )}
      {frequentFollowers.length > 0 && (
        <SuggestedSection
          title="Frequent Followers"
          words={frequentFollowers}
          handleRightClick={handleRightClick}
          handleLeftClick={handleLeftClick}
        />
      )}
      {relatedWords.length > 0 && (
        <SuggestedSection
          title="Related Words"
          words={relatedWords}
          handleRightClick={handleRightClick}
          handleLeftClick={handleLeftClick}
        />
      )}
    </div>
  );
};

export default Suggested;
