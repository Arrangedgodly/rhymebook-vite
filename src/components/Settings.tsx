import { useEffect, useState, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import {
  DEFAULT_RHYME_SETTINGS,
  coerceSettings,
  type RhymeSettings,
} from "../types/settings";
import type { RelationKey, ThemeEngine } from "../utils/rhymeApi";
import type { AppUser } from "../types/user";
import Loading from "./Loading";

const SettingsDashboard = lazy(() => import("./SettingsDashboard"));
const SettingsProfile = lazy(() => import("./SettingsProfile"));

type Tab = "suggestions" | "account";

interface SettingsProps {
  currentUser: AppUser | null;
  setCurrentUser: (user: AppUser | null) => void;
}

const Settings = ({ currentUser, setCurrentUser }: SettingsProps) => {
  const [tab, setTab] = useState<Tab>("suggestions");
  const [settings, setSettings] = useState<RhymeSettings>(DEFAULT_RHYME_SETTINGS);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle"
  );
  const navigate = useNavigate();
  const db = getFirestore();

  useEffect(() => {
    if (!currentUser) {
      navigate("/");
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const snap = await getDoc(doc(db, "users", currentUser.uid));
        if (cancelled || !snap.exists()) return;
        setSettings(coerceSettings(snap.data().settings));
      } catch {
        // Keep the defaults on screen if the document can't be read.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [currentUser, db, navigate]);

  const toggle = (key: RelationKey) => {
    setStatus("idle");
    setSettings((prev) => ({
      ...prev,
      enabled: { ...prev.enabled, [key]: !prev.enabled[key] },
    }));
  };

  const setEngine = (engine: ThemeEngine) => {
    setStatus("idle");
    setSettings((prev) => ({ ...prev, engine }));
  };

  const setMax = (max: number) => {
    setStatus("idle");
    setSettings((prev) => ({ ...prev, max }));
  };

  const handleSave = async () => {
    if (!currentUser) return;
    setStatus("saving");
    try {
      await setDoc(
        doc(db, "users", currentUser.uid),
        { settings },
        { merge: true }
      );
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  };

  if (!currentUser) return null;

  const tabs: { id: Tab; label: string }[] = [
    { id: "suggestions", label: "Suggestions" },
    { id: "account", label: "Account" },
  ];

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6 md:py-10">
      <h1 className="text-2xl font-bold md:text-3xl">Settings</h1>

      <div role="tablist" className="mt-5 flex gap-1 border-b border-base-300">
        {tabs.map(({ id, label }) => (
          <button
            key={id}
            role="tab"
            type="button"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={[
              "-mb-px border-b-2 px-3 py-2 text-sm font-medium transition",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
              tab === id
                ? "border-primary text-primary"
                : "border-transparent opacity-60 hover:opacity-100",
            ].join(" ")}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-5">
        <Suspense fallback={<Loading />}>
          {tab === "suggestions" ? (
            <SettingsDashboard
              settings={settings}
              onToggle={toggle}
              onEngineChange={setEngine}
              onMaxChange={setMax}
              onSave={handleSave}
              status={status}
            />
          ) : (
            <SettingsProfile currentUser={currentUser} setCurrentUser={setCurrentUser} />
          )}
        </Suspense>
      </div>
    </div>
  );
};

export default Settings;
