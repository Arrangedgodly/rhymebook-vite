import { describe, expect, it } from "vitest";
import { computeSyncStatus } from "./sync";
import type { LineTiming, SyncDoc } from "./sync";

function line(overrides: Partial<LineTiming> & Pick<LineTiming, "lineId">): LineTiming {
  return {
    snapshotIndex: 0,
    text: "some line",
    start: 0,
    end: 1,
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

describe("computeSyncStatus", () => {
  it("is complete when every line has start and end", () => {
    const a = line({ lineId: "a", start: 0, end: 1 });
    const b = line({ lineId: "b", start: 1, end: 2 });
    const result = computeSyncStatus(
      doc({ lines: { a, b }, lineOrder: ["a", "b"] })
    );
    expect(result).toBe("complete");
  });

  it("is draft when any line is still untimed", () => {
    const a = line({ lineId: "a", start: 0, end: 1 });
    const b = line({ lineId: "b", start: null, end: null });
    const result = computeSyncStatus(
      doc({ lines: { a, b }, lineOrder: ["a", "b"] })
    );
    expect(result).toBe("draft");
  });

  it("is draft when the doc is flagged needsReview even if every line is timed", () => {
    const a = line({ lineId: "a", start: 0, end: 1 });
    const result = computeSyncStatus(
      doc({ lines: { a }, lineOrder: ["a"], needsReview: true })
    );
    expect(result).toBe("draft");
  });

  it("is draft when a line-needs-review warning is present", () => {
    const a = line({ lineId: "a", start: 0, end: 1 });
    const result = computeSyncStatus(
      doc({
        lines: { a },
        lineOrder: ["a"],
        warnings: [{ code: "line-needs-review", message: "check this" }],
      })
    );
    expect(result).toBe("draft");
  });

  it("is not blocked by a non-blocking warning like audio-changed", () => {
    const a = line({ lineId: "a", start: 0, end: 1 });
    const result = computeSyncStatus(
      doc({
        lines: { a },
        lineOrder: ["a"],
        warnings: [{ code: "audio-changed", message: "verify the sync" }],
      })
    );
    expect(result).toBe("complete");
  });

  it("is draft when an individual line is flagged needsReview", () => {
    const a = line({ lineId: "a", start: 0, end: 1, needsReview: true });
    const result = computeSyncStatus(
      doc({ lines: { a }, lineOrder: ["a"] })
    );
    expect(result).toBe("draft");
  });

  it("never lets missing or partial word timing affect completeness", () => {
    const a = line({
      lineId: "a",
      start: 0,
      end: 1,
      words: [
        { text: "hello", start: null, end: null },
        { text: "world", start: 0.5, end: null },
      ],
    });
    const result = computeSyncStatus(
      doc({ lines: { a }, lineOrder: ["a"] })
    );
    expect(result).toBe("complete");
  });
});
