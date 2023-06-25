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
  const [engine, setEngine] = useState<string>('topic');
  const [max, setMax] = useState<number>(25);

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
    <div className='container-main'>
      <h1 className='text-3xl font-bold text-center m-5'>User Settings</h1>
      <div className='flex flex-col items-center justify-center w-full'>
        <div className='form-control'>
          <label className='label cursor-pointer'>
            <span className='label-text text-xl mr-5'>Rhymes</span>
          <input type='checkbox' checked={rhy} onChange={() => setRhy(!rhy)} className='checkbox' />
          </label>
        </div>
      </div>
    </div>
  )
}

export default Settings;