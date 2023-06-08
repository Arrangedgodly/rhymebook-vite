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
  return (
    <div className="flex flex-col justify-around items-center w-1/2 h-[70vh] my-auto m-5 bg-accent text-accent-content rounded-2xl">
      {rhymes.length > 0 && (
        <>
          <h3 className="text-md m-2">Rhymes</h3>
          <div className="flex flex-row flex-wrap justify-around overflow-y-scroll">
            {rhymes.map((rhyme) => (
              <span className="badge badge-outline m-1">{rhyme}</span>
            ))}
          </div>
        </>
      )}
      {soundAlikes.length > 0 && (
        <>
          <h3 className="text-md m-2">Sound-Alikes</h3>
          <div className="flex flex-row flex-wrap justify-around overflow-y-scroll">
            {soundAlikes.map((soundAlike) => (
              <span className="badge badge-outline m-1">{soundAlike}</span>
            ))}
          </div>
        </>
      )}
      {nouns.length > 0 && (
        <>
          <h3 className="text-md m-2">Nouns</h3>
          <div className="flex flex-row flex-wrap justify-around overflow-y-scroll">
            {nouns.map((noun) => (
              <span className="badge badge-outline m-1">{noun}</span>
            ))}
          </div>
        </>
      )}
      {adjectives.length > 0 && (
        <>
          <h3 className="text-md m-2">Adjectives</h3>
          <div className="flex flex-row flex-wrap justify-around overflow-y-scroll">
            {adjectives.map((adjective) => (
              <span className="badge badge-outline m-1">{adjective}</span>
            ))}
          </div>
        </>
      )}
      {synonyms.length > 0 && (
        <>
          <h3 className="text-md m-2">Synonyms</h3>
          <div className="flex flex-row flex-wrap justify-around overflow-y-scroll">
            {synonyms.map((synonym) => (
              <span className="badge badge-outline m-1">{synonym}</span>
            ))}
          </div>
        </>
      )}
      {antonyms.length > 0 && (
        <>
          <h3 className="text-md m-2">Antonyms</h3>
          <div className="flex flex-row flex-wrap justify-around overflow-y-scroll">
            {antonyms.map((antonym) => (
              <span className="badge badge-outline m-1">{antonym}</span>
            ))}
          </div>
        </>
      )}
      {frequentFollowers.length > 0 && (
        <>
          <h3 className="text-md m-2">Frequent Followers</h3>
          <div className="flex flex-row flex-wrap justify-around overflow-y-scroll">
            {frequentFollowers.map((frequentFollower) => (
              <span className="badge badge-outline m-1">
                {frequentFollower}
              </span>
            ))}
          </div>
        </>
      )}
      {relatedWords.length > 0 && (
        <>
          <h3 className="text-md m-2">Related Words</h3>
          <div className="flex flex-row flex-wrap justify-around overflow-y-scroll">
            {relatedWords.map((relatedWord) => (
              <span className="badge badge-outline m-1">{relatedWord}</span>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Suggested;
