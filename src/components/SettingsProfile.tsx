interface SettingsProfileProps {
  activeTab: string;
  handleProfileTabClick: () => void;
}

const SettingsProfile = ({
  activeTab,
  handleProfileTabClick,
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
      ></div>
    </div>
  );
};

export default SettingsProfile;
