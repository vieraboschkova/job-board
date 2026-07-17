import { describe, expect, it } from "vitest";
import { parseNumber } from "../parse-number";

describe("parseNumber", () => {
  it("returns valid number", () => {
    expect(parseNumber(120000)).toBe(120000);
  });

  it("returns zero", () => {
    expect(parseNumber(0)).toBe(0);
  });

  it("returns undefined for NaN", () => {
    expect(parseNumber(Number.NaN)).toBeUndefined();
  });

  it("returns undefined for Infinity", () => {
    expect(parseNumber(Number.POSITIVE_INFINITY)).toBeUndefined();
  });

  it("returns undefined for non-number values", () => {
    expect(parseNumber("120000")).toBeUndefined();

    expect(parseNumber(null)).toBeUndefined();

    expect(parseNumber({})).toBeUndefined();
  });
});
