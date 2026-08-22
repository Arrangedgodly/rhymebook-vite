/**
 * Reconciles a sync's line timing against edited lyrics.
 *
 * Automation philosophy: preserve what we know, never silently rewrite
 * timing. A line that survives unchanged keeps its timing. A line that
 * changed, moved ambiguously, or was removed is never deleted or guessed at
 * -- it's flagged for the writer to resolve by hand.
 */

export interface LineMatch {
  oldIndex: number;
  newIndex: number;
}

export interface ReconcileResult {
  /** old-index/new-index pairs whose text matches exactly -- timing carries forward untouched. */
  matches: LineMatch[];
  /**
   * Old indices with no safe match. Their timing is kept, never deleted, and
   * flagged `needsReview` by the caller.
   */
  orphanedOldIndices: number[];
  /** New indices with no safe match -- brand new lines with no timing yet. */
  newLineIndices: number[];
}

/**
 * Longest common subsequence of `oldLines`/`newLines` under exact string
 * equality, order-preserving. Matched lines are the safe carry-forward set;
 * everything else is surfaced for review rather than guessed at (including
 * a genuine reorder of two identical-text lines -- the LCS keeps whichever
 * pairing is longer and orphans the other side, which is the right call
 * since there's no way to know which timing belongs where).
 */
export function reconcileLines(
  oldLines: string[],
  newLines: string[]
): ReconcileResult {
  const n = oldLines.length;
  const m = newLines.length;

  // dp[i][j] = length of the LCS of oldLines[0..i) and newLines[0..j).
  const dp: number[][] = Array.from({ length: n + 1 }, () =>
    new Array<number>(m + 1).fill(0)
  );
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      dp[i][j] =
        oldLines[i - 1] === newLines[j - 1]
          ? dp[i - 1][j - 1] + 1
          : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }

  const matches: LineMatch[] = [];
  let i = n;
  let j = m;
  while (i > 0 && j > 0) {
    if (oldLines[i - 1] === newLines[j - 1]) {
      matches.unshift({ oldIndex: i - 1, newIndex: j - 1 });
      i--;
      j--;
    } else if (dp[i - 1][j] >= dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }

  const matchedOld = new Set(matches.map((m) => m.oldIndex));
  const matchedNew = new Set(matches.map((m) => m.newIndex));

  const orphanedOldIndices = oldLines
    .map((_, idx) => idx)
    .filter((idx) => !matchedOld.has(idx));
  const newLineIndices = newLines
    .map((_, idx) => idx)
    .filter((idx) => !matchedNew.has(idx));

  return { matches, orphanedOldIndices, newLineIndices };
}
