import { describe, expect, it } from "vitest";

import { parseDescription } from "../parse-description";

describe("parseDescription", () => {
  it("parses description field", () => {
    expect(
      parseDescription({
        description: "Build scalable APIs.",
      }),
    ).toBe("Build scalable APIs.");
  });

  it("falls back to body", () => {
    expect(
      parseDescription({
        body: "Join our product team.",
      }),
    ).toBe("Join our product team.");
  });

  it("falls back to summary", () => {
    expect(
      parseDescription({
        summary: "Own acquisition campaigns.",
      }),
    ).toBe("Own acquisition campaigns.");
  });

  it("prefers description over aliases", () => {
    expect(
      parseDescription({
        description: "Primary description",
        summary: "Secondary summary",
      }),
    ).toBe("Primary description");
  });

  it("returns undefined for blank description", () => {
    expect(parseDescription({ description: "" })).toBeUndefined();
  });

  it("returns undefined when description fields are missing", () => {
    expect(parseDescription({})).toBeUndefined();
  });
});
