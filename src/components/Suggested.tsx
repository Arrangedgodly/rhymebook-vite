import { getDefinition } from "../utils/dictionaryApi";
import { useEffect, useState } from "react";

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
      for (let i = 0; i < res.length; i++) {
        def.push(res[i].definition);
        pos.push(res[i].partOfSpeech);
      }
      setDefinitions(def);
      setPartsOfSpeech(pos);
    })
  }

  const handleRightClick = (e) => {
    e.preventDefault();
    const word = e.target.innerText;
    handleDefinitions(word);
  }

  return (
    <div className="flex flex-col justify-around items-center w-1/2 h-[70vh] my-auto m-5 bg-accent text-accent-content rounded-2xl">
      {rhymes.length > 0 && (
        <>
          <h3 className="text-sm mt-2 mb-1">Rhymes</h3>
          <div className="flex flex-row flex-wrap justify-around overflow-y-scroll">
            {rhymes.map((rhyme) => (
              <span className="badge badge-outline badge-sm m-1">{rhyme}</span>
            ))}
          </div>
        </>
      )}
      {soundAlikes.length > 0 && (
        <>
          <h3 className="text-sm mt-2 mb-1">Sound-Alikes</h3>
          <div className="flex flex-row flex-wrap justify-around overflow-y-scroll">
            {soundAlikes.map((soundAlike) => (
              <span className="badge badge-outline badge-sm m-1">{soundAlike}</span>
            ))}
          </div>
        </>
      )}
      {nouns.length > 0 && (
        <>
          <h3 className="text-sm mt-2 mb-1">Nouns</h3>
          <div className="flex flex-row flex-wrap justify-around overflow-y-scroll">
            {nouns.map((noun) => (
              <span className="badge badge-outline badge-sm m-1">{noun}</span>
            ))}
          </div>
        </>
      )}
      {adjectives.length > 0 && (
        <>
          <h3 className="text-sm mt-2 mb-1">Adjectives</h3>
          <div className="flex flex-row flex-wrap justify-around overflow-y-scroll">
            {adjectives.map((adjective) => (
              <span className="badge badge-outline badge-sm m-1">{adjective}</span>
            ))}
          </div>
        </>
      )}
      {synonyms.length > 0 && (
        <>
          <h3 className="text-sm mt-2 mb-1">Synonyms</h3>
          <div className="flex flex-row flex-wrap justify-around overflow-y-scroll">
            {synonyms.map((synonym) => (
              <span className="badge badge-outline badge-sm m-1">{synonym}</span>
            ))}
          </div>
        </>
      )}
      {antonyms.length > 0 && (
        <>
          <h3 className="text-sm mt-2 mb-1">Antonyms</h3>
          <div className="flex flex-row flex-wrap justify-around overflow-y-scroll">
            {antonyms.map((antonym) => (
              <span className="badge badge-outline badge-sm m-1">{antonym}</span>
            ))}
          </div>
        </>
      )}
      {frequentFollowers.length > 0 && (
        <>
          <h3 className="text-sm mt-2 mb-1">Frequent Followers</h3>
          <div className="flex flex-row flex-wrap justify-around overflow-y-scroll">
            {frequentFollowers.map((frequentFollower) => (
              <span className="badge badge-outline badge-sm m-1">
                {frequentFollower}
              </span>
            ))}
          </div>
        </>
      )}
      {relatedWords.length > 0 && (
        <>
          <h3 className="text-sm mt-2 mb-1">Related Words</h3>
          <div className="flex flex-row flex-wrap justify-around overflow-y-scroll">
            {relatedWords.map((relatedWord) => (
              <span className="badge badge-outline badge-sm m-1">{relatedWord}</span>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Suggested;
