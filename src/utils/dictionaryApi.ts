const DICTIONARY_URL = "https://api.dictionaryapi.dev/api/v2/entries/en_US/";

export interface DefinitionSense {
  definition: string;
  example?: string;
}

export interface DefinitionMeaning {
  partOfSpeech: string;
  definitions: DefinitionSense[];
}

export interface DictionaryEntry {
  word: string;
  meanings: DefinitionMeaning[];
}

/**
 * Look up a word.
 *
 * Returns null when the dictionary genuinely has no entry (404). Any other
 * failure throws, because "the service is down" and "that isn't a word" are
 * different things to tell a writer -- and this API returns 5xx often enough
 * that conflating them is actively misleading.
 */
export async function getDefinition(
  word: string,
  signal?: AbortSignal
): Promise<DictionaryEntry | null> {
  const res = await fetch(`${DICTIONARY_URL}${encodeURIComponent(word)}`, {
    signal,
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Dictionary responded ${res.status}`);
  const entries: DictionaryEntry[] = await res.json();
  return entries[0] ?? null;
}
