import { RELATION_KEYS, type RelationKey, type ThemeEngine } from "../utils/rhymeApi";

/** Which suggestion sections to fetch, and how to shape the query. */
export interface RhymeSettings {
  enabled: Record<RelationKey, boolean>;
  engine: ThemeEngine;
  /** Results per section. Datamuse allows far more, but the panel gets unusable. */
  max: number;
}

function allEnabled(): Record<RelationKey, boolean> {
  return Object.fromEntries(RELATION_KEYS.map((k) => [k, true])) as Record<
    RelationKey,
    boolean
  >;
}

export const DEFAULT_RHYME_SETTINGS: RhymeSettings = {
  enabled: allEnabled(),
  engine: "topics",
  max: 25,
};

/**
 * Build a usable settings object from whatever is stored on the user document.
 * Anything missing or malformed falls back to the default rather than throwing,
 * so an old or partial document can't break the dashboard.
 */
export function coerceSettings(raw: unknown): RhymeSettings {
  const defaults = DEFAULT_RHYME_SETTINGS;
  if (!raw || typeof raw !== "object") return defaults;

  const stored = raw as Partial<RhymeSettings>;
  const enabled = allEnabled();
  if (stored.enabled && typeof stored.enabled === "object") {
    for (const key of RELATION_KEYS) {
      const value = stored.enabled[key];
      if (typeof value === "boolean") enabled[key] = value;
    }
  }

  const max =
    typeof stored.max === "number" && stored.max >= 5 && stored.max <= 100
      ? stored.max
      : defaults.max;

  const engine: ThemeEngine =
    stored.engine === "ml" || stored.engine === "topics"
      ? stored.engine
      : defaults.engine;

  return { enabled, engine, max };
}
