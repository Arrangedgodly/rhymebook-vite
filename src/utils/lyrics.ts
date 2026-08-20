/**
 * Helpers for reading the word a writer just finished typing.
 *
 * Lyrics are line-based and full of punctuation, so splitting on a literal
 * space (the previous approach) broke as soon as a line break or a comma
 * appeared: the "last word" became something like "one\nnext" or "tonight,",
 * neither of which Datamuse can match.
 */

/** Any run of whitespace separates words, newlines very much included. */
const WHITESPACE = /\s+/;

/**
 * Leading/trailing characters that aren't part of a word. Apostrophes and
 * hyphens are kept so "don't" and "half-light" survive intact.
 */
const EDGE_PUNCTUATION = /^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu;

/** Strip surrounding punctuation and normalise case for API lookup. */
export function normalizeWord(raw: string): string {
  return raw.replace(EDGE_PUNCTUATION, "").toLowerCase();
}

/**
 * The last complete word in `text`, ready to send to Datamuse.
 * Returns "" when there is nothing usable to look up.
 */
export function getLastWord(text: string): string {
  const words = text.trim().split(WHITESPACE).filter(Boolean);
  if (words.length === 0) return "";
  return normalizeWord(words[words.length - 1]);
}

/**
 * Datamuse accepts at most five comma-separated topics. The themes field lets
 * people type them separated by spaces or commas, so accept both.
 */
export function normalizeThemes(themes: string): string {
  return themes
    .split(/[,\s]+/)
    .map((t) => normalizeWord(t))
    .filter(Boolean)
    .slice(0, 5)
    .join(",");
}
