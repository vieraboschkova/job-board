import { describe, expect, it } from "vitest";
import { parseString } from "../parse-string";

describe("parseString", () => {
  it("returns trimmed string", () => {
    expect(parseString("  hello world  ")).toBe("hello world");
  });

  it("returns undefined for empty string", () => {
    expect(parseString("")).toBeUndefined();
  });

  it("returns undefined for whitespace only", () => {
    expect(parseString("   ")).toBeUndefined();
  });

  it("returns undefined for non-string values", () => {
    expect(parseString(null)).toBeUndefined();
    expect(parseString(123)).toBeUndefined();
    expect(parseString({})).toBeUndefined();
    expect(parseString([])).toBeUndefined();
  });
});
