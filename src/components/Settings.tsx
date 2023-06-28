import { useState, useEffect } from "react";
import SettingsDashboard from "./SettingsDashboard";
import SettingsProfile from "./SettingsProfile";

interface SettingsProps {
  currentUser: any;
}

const Settings = ({ currentUser }: SettingsProps) => {
  const [activeTab, setActiveTab] = useState<string>("");
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

  const handleProfileTabClick = () => {
    if (activeTab === "profile") {
      setActiveTab("");
    } else {
      setActiveTab("profile");
    }
  }

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
      <h1 className="text-5xl text-primary font-bold text-center m-5">
        User Settings
      </h1>
      <SettingsDashboard
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        preferenceBooleans={preferenceBooleans}
        engine={engine}
        setEngine={setEngine}
        max={max}
        setMax={setMax}
      />
      <SettingsProfile
        activeTab={activeTab}
        handleProfileTabClick={handleProfileTabClick}
      />
    </div>
  );
};

export default Settings;
