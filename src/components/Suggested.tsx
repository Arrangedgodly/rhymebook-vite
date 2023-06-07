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
    <table className="table table-lg table-pin-rows w-2/5 m-5 bg-accent text-accent-content rounded-2xl">
      <thead>
        <tr>
          {rhymes.length > 0 && <td>Rhymes</td>}
          {soundAlikes.length > 0 && <td>Sound-Alikes</td>}
          {nouns.length > 0 && <td>Nouns</td>}
          {adjectives.length > 0 && <td>Adjectives</td>}
          {synonyms.length > 0 && <td>Synonyms</td>}
          {antonyms.length > 0 && <td>Antonyms</td>}
          {frequentFollowers.length > 0 && <td>Frequent Followers</td>}
          {relatedWords.length > 0 && <td>Related Words</td>}
        </tr>
        
      </thead>
    </table>
  );
};

export default Suggested;
