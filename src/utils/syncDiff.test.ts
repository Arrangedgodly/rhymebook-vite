import { describe, expect, it } from "vitest";
import { reconcileLines } from "./syncDiff";

describe("reconcileLines", () => {
  it("matches every line when nothing changed", () => {
    const lines = ["I remember", "driving down", "that road"];
    const result = reconcileLines(lines, lines);
    expect(result.matches).toEqual([
      { oldIndex: 0, newIndex: 0 },
      { oldIndex: 1, newIndex: 1 },
      { oldIndex: 2, newIndex: 2 },
    ]);
    expect(result.orphanedOldIndices).toEqual([]);
    expect(result.newLineIndices).toEqual([]);
  });

  it("orphans a changed middle line and treats its replacement as new", () => {
    const oldLines = ["verse one", "verse two", "verse three"];
    const newLines = ["verse one", "verse two edited", "verse three"];
    const result = reconcileLines(oldLines, newLines);
    expect(result.matches).toEqual([
      { oldIndex: 0, newIndex: 0 },
      { oldIndex: 2, newIndex: 2 },
    ]);
    expect(result.orphanedOldIndices).toEqual([1]);
    expect(result.newLineIndices).toEqual([1]);
  });

  it("flags an added line as new without orphaning anything", () => {
    const oldLines = ["intro", "outro"];
    const newLines = ["intro", "new middle", "outro"];
    const result = reconcileLines(oldLines, newLines);
    expect(result.orphanedOldIndices).toEqual([]);
    expect(result.newLineIndices).toEqual([1]);
    expect(result.matches).toEqual([
      { oldIndex: 0, newIndex: 0 },
      { oldIndex: 1, newIndex: 2 },
    ]);
  });

  it("orphans a removed line without inventing a new one", () => {
    const oldLines = ["intro", "middle", "outro"];
    const newLines = ["intro", "outro"];
    const result = reconcileLines(oldLines, newLines);
    expect(result.orphanedOldIndices).toEqual([1]);
    expect(result.newLineIndices).toEqual([]);
  });

  it("carries forward every instance of a repeated line, in order", () => {
    const lines = ["hello", "chorus line", "world", "chorus line"];
    const result = reconcileLines(lines, lines);
    expect(result.matches).toHaveLength(4);
    expect(result.orphanedOldIndices).toEqual([]);
    expect(result.newLineIndices).toEqual([]);
  });

  it("orphans one side of a genuine reorder rather than guessing which timing belongs where", () => {
    // Neither line's text is ambiguous individually -- the LCS can only
    // preserve one of them across the swap, per the function's own doc comment.
    const result = reconcileLines(["A line", "B line"], ["B line", "A line"]);
    expect(result.matches).toHaveLength(1);
    expect(result.orphanedOldIndices).toHaveLength(1);
    expect(result.newLineIndices).toHaveLength(1);
  });

  it("treats everything as new when there were no old lines", () => {
    const result = reconcileLines([], ["a", "b"]);
    expect(result.matches).toEqual([]);
    expect(result.orphanedOldIndices).toEqual([]);
    expect(result.newLineIndices).toEqual([0, 1]);
  });

  it("orphans everything when every line was removed", () => {
    const result = reconcileLines(["a", "b"], []);
    expect(result.matches).toEqual([]);
    expect(result.orphanedOldIndices).toEqual([0, 1]);
    expect(result.newLineIndices).toEqual([]);
  });
});
