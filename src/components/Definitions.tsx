interface DefinitionsProps {
  definitions: any;
}

const Definitions = ({ definitions }: DefinitionsProps) => {
  const meanings = definitions?.meanings;

  return (
    <div className="flex flex-col justify-start items-center w-1/5 my-auto m-5 max-h-[70vh] overflow-y-auto text-center">
      {definitions && (
        <>
          <h1 className="text-2xl font-bold m-5">{definitions.word}</h1>
          {meanings && meanings.map((meaning: any, index: number) => (
            <div key={index}>
              <h2 className="text-xl font-bold m-2">{meaning.partOfSpeech}</h2>
              {meaning.definitions.map((definition: any, index: number) => (
                <div key={index}>
                  <p className="text-lg m-2">{definition.definition}</p>
                  {definition.example && (
                    <p className="text-md italic m-2">"{definition.example}"</p>
                  )}
                </div>
              ))}
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default Definitions;
