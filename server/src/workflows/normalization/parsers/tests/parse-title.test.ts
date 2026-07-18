import { describe, expect, it } from "vitest";

import { parseTitle } from "../parse-title";

describe("parseTitle", () => {
  it("parses title field", () => {
    expect(parseTitle({ title: "Backend Engineer" })).toBe("Backend Engineer");
  });

  it("falls back to jobTitle", () => {
    expect(parseTitle({ jobTitle: "Frontend Developer" })).toBe(
      "Frontend Developer",
    );
  });

  it("falls back to position", () => {
    expect(parseTitle({ position: "Product Manager" })).toBe("Product Manager");
  });

  it("falls back to role", () => {
    expect(parseTitle({ role: "Staff Engineer" })).toBe("Staff Engineer");
  });

  it("prefers title over aliases", () => {
    expect(
      parseTitle({
        title: "Primary Title",
        jobTitle: "Secondary Title",
      }),
    ).toBe("Primary Title");
  });

  it("returns undefined for blank title", () => {
    expect(parseTitle({ title: "   " })).toBeUndefined();
  });

  it("returns undefined when title fields are missing", () => {
    expect(parseTitle({})).toBeUndefined();
  });
});
