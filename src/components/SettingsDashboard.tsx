import { RELATIONS, RELATION_KEYS, type RelationKey } from "../utils/rhymeApi";
import type { ThemeEngine } from "../utils/rhymeApi";
import type { RhymeSettings } from "../types/settings";
import { SettingsSection } from "./SettingsSection";

interface SettingsDashboardProps {
  settings: RhymeSettings;
  onToggle: (key: RelationKey) => void;
  onEngineChange: (engine: ThemeEngine) => void;
  onMaxChange: (max: number) => void;
  onSave: () => void;
  status: "idle" | "saving" | "saved" | "error";
}

const STATUS_TEXT = {
  idle: "Save preferences",
  saving: "Saving...",
  saved: "Saved",
  error: "Could not save - try again",
} as const;

const SettingsDashboard = ({
  settings,
  onToggle,
  onEngineChange,
  onMaxChange,
  onSave,
  status,
}: SettingsDashboardProps) => {
  const enabledCount = RELATION_KEYS.filter((k) => settings.enabled[k]).length;

  return (
    <div className="flex flex-col gap-4">
      <SettingsSection
        title="Categories"
        description={`Which suggestion tabs appear while you write. ${enabledCount} of ${RELATION_KEYS.length} on.`}
      >
        <ul className="flex flex-col divide-y divide-base-300">
          {RELATION_KEYS.map((key) => (
            <li key={key} className="flex items-start gap-3 py-2.5">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{RELATIONS[key].label}</p>
                <p className="text-xs opacity-55">{RELATIONS[key].hint}</p>
              </div>
              <input
                type="checkbox"
                aria-label={RELATIONS[key].label}
                checked={settings.enabled[key]}
                onChange={() => onToggle(key)}
                className="toggle toggle-primary toggle-sm mt-0.5 shrink-0"
              />
            </li>
          ))}
        </ul>
      </SettingsSection>

      <SettingsSection
        title="Theme matching"
        description="How hard the Themes field on the dashboard pulls results toward your subject."
      >
        <div className="flex flex-col gap-2">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="radio"
              name="engine"
              className="radio radio-primary radio-sm mt-0.5"
              checked={settings.engine === "topics"}
              onChange={() => onEngineChange("topics")}
            />
            <span className="min-w-0">
              <span className="block text-sm font-medium">Broad</span>
              <span className="block text-xs opacity-55">
                Nudges results toward your themes but keeps the list full.
              </span>
            </span>
          </label>
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="radio"
              name="engine"
              className="radio radio-primary radio-sm mt-0.5"
              checked={settings.engine === "ml"}
              onChange={() => onEngineChange("ml")}
            />
            <span className="min-w-0">
              <span className="block text-sm font-medium">Specific</span>
              <span className="block text-xs opacity-55">
                Demands results actually mean something like your themes. Far
                fewer words, sometimes none.
              </span>
            </span>
          </label>
        </div>
      </SettingsSection>

      <SettingsSection
        title="Results per category"
        description="More words means more scrolling in the suggestion panel."
      >
        <div className="flex items-center gap-4">
          <input
            type="range"
            aria-label="Results per category"
            min="5"
            max="50"
            step={5}
            value={settings.max}
            onChange={(e) => onMaxChange(parseInt(e.target.value, 10))}
            className="range range-primary range-sm flex-1"
          />
          <span className="w-8 text-right text-sm tabular-nums">
            {settings.max}
          </span>
        </div>
      </SettingsSection>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={onSave}
          disabled={status === "saving"}
        >
          {STATUS_TEXT[status]}
        </button>
        {status === "saved" && (
          <span role="status" className="text-sm text-success">
            Applied to your dashboard.
          </span>
        )}
        {status === "error" && (
          <span role="status" className="text-sm text-error">
            Check your connection and try again.
          </span>
        )}
      </div>
    </div>
  );
};

export default SettingsDashboard;
