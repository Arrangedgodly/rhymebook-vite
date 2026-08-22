import { describe, expect, it } from "vitest";
import { slugForFilename, toExportJson, toLrc } from "./syncExport";
import type { LineTiming, SyncDoc } from "../types/sync";

function line(overrides: Partial<LineTiming> & Pick<LineTiming, "lineId">): LineTiming {
  return {
    snapshotIndex: 0,
    text: "some line",
    start: null,
    end: null,
    source: "fast-sync",
    ...overrides,
  };
}

function doc(overrides: Partial<SyncDoc> = {}): SyncDoc {
  return {
    id: "main",
    lyricsSnapshot: "",
    snapshotLines: [],
    lines: {},
    lineOrder: [],
    needsReview: false,
    warnings: [],
    createdBy: "uid",
    ...overrides,
  };
}

describe("toLrc", () => {
  it("emits one timestamped line per timed entry, sorted by start", () => {
    // lineOrder is deliberately out of chronological order -- toLrc must sort by start, not lineOrder.
    const first = line({ lineId: "first", text: "First line", start: 12.4, end: 16.8 });
    const second = line({ lineId: "second", text: "Second line", start: 1.5, end: 5 });
    const lrc = toLrc(
      doc({ lines: { first, second }, lineOrder: ["first", "second"] }),
      "My Song"
    );
    expect(lrc).toBe(
      ["[ti:My Song]", "[00:01.50]Second line", "[00:12.40]First line"].join("\n")
    );
  });

  it("skips lines that were never marked", () => {
    const timed = line({ lineId: "timed", text: "Timed", start: 0, end: 1 });
    const untimed = line({ lineId: "untimed", text: "Untimed" });
    const lrc = toLrc(
      doc({ lines: { timed, untimed }, lineOrder: ["timed", "untimed"] }),
      "Title"
    );
    expect(lrc).toBe(["[ti:Title]", "[00:00.00]Timed"].join("\n"));
  });

  it("falls back to Untitled when the title is empty", () => {
    expect(toLrc(doc(), "")).toBe("[ti:Untitled]");
  });
});

describe("toExportJson", () => {
  it("includes full line and word timing, with status derived the usual way", () => {
    const a = line({
      lineId: "a",
      text: "I remember",
      start: 0,
      end: 2,
      words: [{ text: "I", start: 0, end: 0.3 }, { text: "remember", start: 0.3, end: 2 }],
    });
    const result = toExportJson(doc({ lines: { a }, lineOrder: ["a"] }), "My Song") as {
      title: string;
      status: string;
      lines: unknown[];
    };
    expect(result.title).toBe("My Song");
    expect(result.status).toBe("complete");
    expect(result.lines).toEqual([
      {
        text: "I remember",
        start: 0,
        end: 2,
        words: [
          { text: "I", start: 0, end: 0.3 },
          { text: "remember", start: 0.3, end: 2 },
        ],
      },
    ]);
  });

  it("reflects draft status for an incomplete sync", () => {
    const a = line({ lineId: "a", start: null, end: null });
    const result = toExportJson(doc({ lines: { a }, lineOrder: ["a"] }), "Title") as {
      status: string;
    };
    expect(result.status).toBe("draft");
  });
});

describe("slugForFilename", () => {
  it("lowercases and hyphenates the title", () => {
    expect(slugForFilename("My Great Song!")).toBe("my-great-song");
  });

  it("strips leading/trailing hyphens left by punctuation", () => {
    expect(slugForFilename("...Loading...")).toBe("loading");
  });

  it("falls back to 'song' for an empty or whitespace-only title", () => {
    expect(slugForFilename("")).toBe("song");
    expect(slugForFilename("   ")).toBe("song");
  });
});
