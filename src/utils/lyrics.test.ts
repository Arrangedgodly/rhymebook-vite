import { describe, expect, it } from "vitest";
import { splitLyricLines, splitWords } from "./lyrics";

describe("splitLyricLines", () => {
  it("drops blank lines used for verse/chorus spacing", () => {
    const lyrics = "Line one\n\nLine two\n   \nLine three";
    expect(splitLyricLines(lyrics)).toEqual(["Line one", "Line two", "Line three"]);
  });

  it("preserves order and keeps punctuation intact", () => {
    const lyrics = "I remember, driving down\nthat road at night.";
    expect(splitLyricLines(lyrics)).toEqual([
      "I remember, driving down",
      "that road at night.",
    ]);
  });

  it("returns an empty array for lyrics that are only blank lines", () => {
    expect(splitLyricLines("\n\n   \n")).toEqual([]);
  });
});

describe("splitWords", () => {
  it("splits on whitespace and keeps punctuation on each word", () => {
    expect(splitWords("I don't wanna go, half-light fading")).toEqual([
      "I",
      "don't",
      "wanna",
      "go,",
      "half-light",
      "fading",
    ]);
  });

  it("collapses repeated whitespace and trims the ends", () => {
    expect(splitWords("  one   two    three  ")).toEqual(["one", "two", "three"]);
  });

  it("returns an empty array for whitespace-only text", () => {
    expect(splitWords("   ")).toEqual([]);
  });
});
