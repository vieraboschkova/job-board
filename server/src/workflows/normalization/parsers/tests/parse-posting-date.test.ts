import { describe, expect, it } from "vitest";
import { parsePostingDate } from "../parse-posting-date";

describe("parsePostingDate", () => {
  it("parses valid date", () => {
    expect(parsePostingDate("2023-10-03")).toEqual(new Date("2023-10-03"));
  });

  it("returns undefined for empty string", () => {
    expect(parsePostingDate("")).toBeUndefined();
  });

  it("returns undefined for invalid date", () => {
    expect(parsePostingDate("invalid-date")).toBeUndefined();
  });

  it("returns undefined for non-string", () => {
    expect(parsePostingDate(123)).toBeUndefined();
  });

  it("trims whitespace", () => {
    expect(parsePostingDate(" 2023-10-03 ")).toEqual(new Date("2023-10-03"));
  });
});
