/**
 * Small fuzzy matcher for institution names. Deliberately dependency-free:
 * the list is short (tens of entries, not thousands), so a scan per
 * keystroke costs nothing and a search library would be more bytes shipped
 * than the whole feature.
 *
 * Names arrive with accents, casing and articles that people won't type —
 * "Museu das Minas e do Metal" gets searched as "minas metal", "mmm",
 * "museu minas". So matching runs on a normalised form and scores three
 * increasingly loose ways of being right, in order:
 *
 *   1. substring — the query appears verbatim in the name
 *   2. token prefixes — every word typed starts a word in the name, in any
 *      order ("minas metal" finds "Museu das Minas e do Metal")
 *   3. subsequence — the query's letters appear in order, gaps allowed;
 *      this is what catches typos and initialisms
 *
 * Stop words are dropped from the *query* only, so typing the generic word
 * "museu" alone doesn't score every museum in the list identically.
 */

const STOP_WORDS = new Set([
  "de",
  "da",
  "do",
  "das",
  "dos",
  "e",
  "the",
  "of",
  "a",
  "o",
  "as",
  "os",
]);

/** Lowercase, strip diacritics, reduce punctuation to spaces. */
export function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function tokens(value: string): string[] {
  return normalize(value).split(" ").filter(Boolean);
}

/**
 * Are `query`'s characters present in `target`, in order? Returns a 0–1
 * density score (1 when they're contiguous) or -1 when they aren't.
 */
function subsequenceScore(query: string, target: string): number {
  let cursor = 0;
  let firstHit = -1;
  let lastHit = -1;

  for (const char of query) {
    const found = target.indexOf(char, cursor);
    if (found === -1) return -1;
    if (firstHit === -1) firstHit = found;
    lastHit = found;
    cursor = found + 1;
  }

  const span = lastHit - firstHit + 1;
  return query.length / span;
}

export type Match<T> = { item: T; score: number };

/**
 * Scores `query` against one name. 0 means no match; higher is better.
 * The bands don't overlap, so a substring hit always outranks a token-prefix
 * hit, which always outranks a bare subsequence.
 */
export function scoreName(query: string, name: string): number {
  const haystack = normalize(name);
  const needle = normalize(query);
  if (!needle || !haystack) return 0;

  if (haystack.includes(needle)) {
    // Earlier and longer matches win; a full-name match tops out at 100.
    const coverage = needle.length / haystack.length;
    const position = haystack.indexOf(needle);
    return 70 + coverage * 30 - Math.min(position, 20) * 0.5;
  }

  const nameTokens = tokens(name);
  const queryTokens = tokens(query).filter(
    (token) => !STOP_WORDS.has(token) || tokens(query).length === 1,
  );

  if (queryTokens.length > 0) {
    const everyTokenLands = queryTokens.every((token) =>
      nameTokens.some((nameToken) => nameToken.startsWith(token)),
    );
    if (everyTokenLands) {
      const typed = queryTokens.join("").length;
      const whole = nameTokens.join("").length;
      return 40 + (typed / whole) * 25;
    }
  }

  const density = subsequenceScore(needle.replace(/ /g, ""), haystack.replace(/ /g, ""));
  if (density > 0) return density * 35;

  return 0;
}

/**
 * Ranks `items` against `query`. `threshold` keeps the list honest — a bare
 * subsequence over a long name scores low, and surfacing those would mean
 * every query "matches" something.
 */
export function fuzzySearch<T>(
  query: string,
  items: readonly T[],
  toStrings: (item: T) => readonly string[],
  { limit = 6, threshold = 12 }: { limit?: number; threshold?: number } = {},
): Match<T>[] {
  if (!normalize(query)) return [];

  return items
    .map((item) => ({
      item,
      score: Math.max(...toStrings(item).map((name) => scoreName(query, name))),
    }))
    .filter((match) => match.score >= threshold)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
