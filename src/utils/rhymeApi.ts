import { normalizeThemes } from "./lyrics";

const RHYME_URL = "https://api.datamuse.com/words";

/** One Datamuse result row. */
export interface RelatedWord {
  word: string;
  score?: number;
  numSyllables?: number;
}

export type RelationKey =
  | "rhyme"
  | "soundAlike"
  | "synonym"
  | "antonym"
  | "adjective"
  | "noun"
  | "relatedWord"
  | "frequentFollower";

interface Relation {
  /** The Datamuse `rel_*` query parameter. */
  param: string;
  /** Section heading shown to the writer. */
  label: string;
  /** Shown in Settings, where there is room to explain what a category is for. */
  hint: string;
}

/**
 * Datamuse relation codes, in the order they're shown.
 *
 * Note `rel_jja` and `rel_jjb` read backwards from their names:
 *   rel_jja -> the *nouns* a given adjective tends to modify (gradual -> increase)
 *   rel_jjb -> the *adjectives* that tend to modify a given noun (beach -> sandy)
 * They were previously wired the other way round, so the Adjectives section
 * listed nouns and vice versa.
 */
export const RELATIONS: Record<RelationKey, Relation> = {
  rhyme: {
    param: "rel_rhy",
    label: "Rhymes",
    hint: "Perfect rhymes. The reliable one.",
  },
  soundAlike: {
    param: "rel_nry",
    label: "Sound-Alikes",
    hint: "Near rhymes. Often returns nothing at all.",
  },
  synonym: {
    param: "rel_syn",
    label: "Synonyms",
    hint: "Words meaning roughly the same thing.",
  },
  antonym: {
    param: "rel_ant",
    label: "Antonyms",
    hint: "Opposites. Usually only a handful, if any.",
  },
  adjective: {
    param: "rel_jjb",
    label: "Adjectives",
    hint: "Adjectives that commonly describe this noun.",
  },
  noun: {
    param: "rel_jja",
    label: "Nouns",
    hint: "Nouns this adjective commonly describes.",
  },
  relatedWord: {
    param: "rel_trg",
    label: "Related Words",
    hint: "Words that tend to appear nearby.",
  },
  frequentFollower: {
    param: "rel_bga",
    label: "Frequent Followers",
    hint: "Words that often follow this one - mostly filler like \"and\" or \"to\".",
  },
};

export const RELATION_KEYS = Object.keys(RELATIONS) as RelationKey[];

/** How themes narrow the results. */
export type ThemeEngine = "topics" | "ml";

export interface RelatedWordQuery {
  /** Free-text themes from the dashboard; blank means "no narrowing". */
  themes?: string;
  /**
   * `topics` nudges results toward the themes but still returns plenty
   * (broad). `ml` demands the results actually mean something like the
   * themes, which returns far fewer (specific).
   */
  engine?: ThemeEngine;
  max?: number;
  signal?: AbortSignal;
}

/**
 * Look up words related to `word`.
 *
 * Returns [] for a blank word rather than firing a request that Datamuse
 * would answer with an empty list anyway.
 */
export async function fetchRelated(
  relation: RelationKey,
  word: string,
  { themes = "", engine = "topics", max = 50, signal }: RelatedWordQuery = {}
): Promise<RelatedWord[]> {
  if (!word) return [];

  const params = new URLSearchParams();
  params.set(RELATIONS[relation].param, word);

  // `topic` (singular) is not a Datamuse parameter -- it was silently ignored,
  // which is why the themes field never changed anything. The real ones are
  // `topics` and `ml`.
  const normalizedThemes = normalizeThemes(themes);
  if (normalizedThemes) {
    params.set(engine, engine === "ml" ? normalizedThemes.replace(/,/g, " ") : normalizedThemes);
  }

  params.set("max", String(max));

  const res = await fetch(`${RHYME_URL}?${params}`, { signal });
  if (!res.ok) throw new Error(`Datamuse responded ${res.status}`);
  return res.json();
}
