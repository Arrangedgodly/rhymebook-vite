import { useState, useEffect } from "react";

interface SettingsProps {
  currentUser: any;
}

const Settings = ({ currentUser }: SettingsProps) => {
  const [rhy, setRhy] = useState<boolean>(true);
  const [sdl, setSdl] = useState<boolean>(true);
  const [adj, setAdj] = useState<boolean>(true);
  const [noun, setNoun] = useState<boolean>(true);
  const [rlwd, setRlwd] = useState<boolean>(true);
  const [syn, setSyn] = useState<boolean>(true);
  const [ant, setAnt] = useState<boolean>(true);
  const [fqfl, setFqfl] = useState<boolean>(true);
  const [engine, setEngine] = useState<string>("topic");
  const [max, setMax] = useState<number>(25);

  const preferenceBooleans = [
    { name: "Rhymes", value: rhy, function: () => setRhy(!rhy) },
    { name: "Sound Alikes", value: sdl, function: () => setSdl(!sdl) },
    { name: "Adjectives", value: adj, function: () => setAdj(!adj) },
    { name: "Related Nouns", value: noun, function: () => setNoun(!noun) },
    { name: "Related Words", value: rlwd, function: () => setRlwd(!rlwd) },
    { name: "Synonyms", value: syn, function: () => setSyn(!syn) },
    { name: "Antonyms", value: ant, function: () => setAnt(!ant) },
    {
      name: "Frequent Following Words",
      value: fqfl,
      function: () => setFqfl(!fqfl),
    },
  ];

  useEffect(() => {
    if (currentUser.settings) {
      setRhy(currentUser.settings.rhy);
      setSdl(currentUser.settings.sdl);
      setAdj(currentUser.settings.adj);
      setNoun(currentUser.settings.noun);
      setRlwd(currentUser.settings.rlwd);
      setSyn(currentUser.settings.syn);
      setAnt(currentUser.settings.ant);
      setFqfl(currentUser.settings.fqfl);
      setEngine(currentUser.settings.engine);
      setMax(currentUser.settings.max);
    }
  }, [currentUser]);

  return (
    <div className="container-main">
      <h1 className="text-5xl text-primary font-bold text-center m-5">User Settings</h1>
      <div className="flex flex-col items-center justify-center w-full">
        <h2 className='text-3xl font-bold text-center text-secondary m-5'>Dashboard / API Engine</h2>
        {preferenceBooleans.map((prefBoolean) => (
          <div className="form-control" key={`${prefBoolean.name}-selector`}>
            <label className="label cursor-pointer">
              <span className="label-text text-xl text-primary-content mr-5">
                {prefBoolean.name}
              </span>
              <input
                type="checkbox"
                checked={prefBoolean.value}
                onChange={prefBoolean.function}
                className="checkbox checkbox-primary"
              />
            </label>
          </div>
        ))}
        <div className="flex flex-col items-center">
          <h3 className="text-2xl font-bold text-center text-secondary m-5">Engine Type</h3>
          <div className="flex flex-row items-center justify-center w-full">
            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text text-xl text-primary-content mr-5">Broad</span>
                <input
                  type="radio"
                  name="engine"
                  value="topic"
                  checked={engine === "topic"}
                  onChange={() => setEngine("topic")}
                  className="radio radio-secondary"
                />
              </label>
            </div>
            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label text text-xl text-primary-content mr-5">Specific</span>
                <input
                  type="radio"
                  name="engine"
                  value="ml"
                  checked={engine === "ml"}
                  onChange={() => setEngine("ml")}
                  className="radio radio-secondary"
                />
              </label>
            </div>
          </div>
          <div className='form-control'>
            <label className='label'>
              <span className='label-text text-xl text-primary-content mr-5'>Max Results</span>
            </label>
            <input
              type='range'
              min='5'
              max='50'
              value={max}
              onChange={(e) => setMax(parseInt(e.target.value))}
              className='range range-primary'
            />
            <span className='text-xl text-primary-content text-center'>{max}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
