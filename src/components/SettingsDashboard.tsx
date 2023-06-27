interface SettingsDashboardProps {
  activeTab: string;
  setActiveTab: (activeTab: string) => void;
  preferenceBooleans: {
    name: string;
    value: boolean;
    function: () => void;
  }[];
  engine: string;
  setEngine: (engine: string) => void;
  max: number;
  setMax: (max: number) => void;
}

const SettingsDashboard = ({
  activeTab,
  setActiveTab,
  preferenceBooleans,
  engine,
  setEngine,
  max,
  setMax,
}: SettingsDashboardProps) => {
  const handleTabClick = () => {
    if (activeTab === 'dashboard') {
      setActiveTab('')
    } else {
      setActiveTab('dashboard')
  }
}

  return (
    <div className="collapse md:w-1/2 w-4/5 bg-secondary text-secondary-content m-5">
      <input type='radio' name='settings' checked={activeTab === 'dashboard' ? true : false} onClick={handleTabClick} />
      <h2 className="collapse-title text-3xl font-bold text-center">
        Dashboard / API Engine
      </h2>
      <div className={activeTab === 'dashboard' ? 'collapse-content transition-all' : 'hidden transition-all'}>
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
          <h3 className="text-2xl font-bold text-center m-5">
            Engine Type
          </h3>
          <div className="flex flex-row items-center justify-center w-full">
            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text text-xl text-primary-content mr-5">
                  Broad
                </span>
                <input
                  type="radio"
                  name="engine"
                  value="topic"
                  checked={engine === "topic"}
                  onChange={() => setEngine("topic")}
                  className="radio radio-primary"
                />
              </label>
            </div>
            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label text text-xl text-primary-content mr-5">
                  Specific
                </span>
                <input
                  type="radio"
                  name="engine"
                  value="ml"
                  checked={engine === "ml"}
                  onChange={() => setEngine("ml")}
                  className="radio radio-primary"
                />
              </label>
            </div>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text text-xl text-primary-content mr-5">
                Max Results
              </span>
            </label>
            <input
              type="range"
              min="5"
              max="50"
              value={max}
              step={5}
              onChange={(e) => setMax(parseInt(e.target.value))}
              className="range range-primary"
            />
            <span className="text-xl text-primary-content text-center">
              {max}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsDashboard;
