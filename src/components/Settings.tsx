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
    if (currentUser) {
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
      <h1 className='text-3xl font-bold text-center'>User Settings</h1>
    </div>
  )
}

export default Settings;