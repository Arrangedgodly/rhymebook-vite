interface SettingsProfileProps {
  activeTab: string;
  handleProfileTabClick: () => void;
  currentUser: any;
}

const SettingsProfile = ({
  activeTab,
  handleProfileTabClick,
  currentUser,
}: SettingsProfileProps) => {
  return (
    <div className="collapse md:w-1/2 w-4/5 bg-secondary text-secondary-content">
      <input
        type="radio"
        name="settings"
        checked={activeTab === "profile" ? true : false}
        onClick={handleProfileTabClick}
      />
      <h2 className="collapse-title text-3xl font-bold text-center">Profile</h2>
      <div
        className={
          activeTab === "profile"
            ? "collapse-content transition-all"
            : "hidden transition-all"
        }
      >
        <div className="form-control">
          <label className="label flex flex-col items-center">
            <span className="label-text text-xl text-primary-content mr-5">
              Name
            </span>
            <input
              type="text"
              placeholder={currentUser.displayName}
              className="input input-primary input-bordered w-3/4 text-center"
            />
          </label>
        </div>
        <div className="form-control">
          <label className="label flex flex-col items-center">
            <span className="label-text text-xl text-primary-content mr-5">
              Email
            </span>
            <input
              type="text"
              placeholder={currentUser.email}
              className="input input-primary input-bordered w-3/4 text-center"
            />
          </label>
        </div>
        <div className="form-control">
          <label className="label flex flex-col items-center">
            <span className="label-text text-xl text-primary-content mr-5">
              Password
            </span>
            <input
              type="password"
              placeholder="********"
              className="input input-primary input-bordered w-3/4 text-center"
            />
          </label>
        </div>
        <div className="form-control">
          <label className="label flex flex-col items-center">
            <span className="label-text text-xl text-primary-content mr-5">
              Confirm Password
            </span>
            <input
              type="password"
              placeholder="********"
              className="input input-primary input-bordered w-3/4 text-center"
            />
          </label>
        </div>
        <button className="btn btn-primary btn-lg m-2 w-full">Save</button>
      </div>
    </div>
  );
};

export default SettingsProfile;
