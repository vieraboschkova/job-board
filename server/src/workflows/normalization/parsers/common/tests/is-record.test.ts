import { describe, expect, it } from "vitest";
import { isRecord } from "../is-record";

describe("isRecord", () => {
  it("returns true for object", () => {
    expect(isRecord({ name: "test" })).toBe(true);
  });

  it("returns false for null", () => {
    expect(isRecord(null)).toBe(false);
  });

  it("returns false for array", () => {
    expect(isRecord([])).toBe(false);
  });

  it("returns false for primitive values", () => {
    expect(isRecord("text")).toBe(false);
    expect(isRecord(123)).toBe(false);
    expect(isRecord(true)).toBe(false);
  });
});
