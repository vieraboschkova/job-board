import { describe, expect, it } from "vitest";

import { parseRemoteFlag } from "../parse-remote-flag";

describe("parseRemoteFlag", () => {
  it("returns true for boolean true", () => {
    expect(parseRemoteFlag(true)).toBe(true);
  });

  it("returns false for boolean false", () => {
    expect(parseRemoteFlag(false)).toBe(false);
  });

  it("returns undefined for non-boolean values", () => {
    expect(parseRemoteFlag("true")).toBeUndefined();
    expect(parseRemoteFlag(1)).toBeUndefined();
    expect(parseRemoteFlag(null)).toBeUndefined();
    expect(parseRemoteFlag(undefined)).toBeUndefined();
  });
});
