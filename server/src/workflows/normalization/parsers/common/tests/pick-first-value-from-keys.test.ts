import { describe, expect, it } from "vitest";

import { pickFirstValueFromKeys } from "../pick-first-value-from-keys";

describe("pickFirstValueFromKeys", () => {
  it("returns the first defined value", () => {
    expect(
      pickFirstValueFromKeys(
        {
          title: "Backend Engineer",
          jobTitle: "Other Title",
        },
        ["title", "jobTitle"],
      ),
    ).toBe("Backend Engineer");
  });

  it("skips null and undefined values", () => {
    expect(
      pickFirstValueFromKeys(
        {
          title: null,
          jobTitle: "Frontend Developer",
        },
        ["title", "jobTitle"],
      ),
    ).toBe("Frontend Developer");
  });

  it("skips blank and whitespace-only strings", () => {
    expect(
      pickFirstValueFromKeys(
        {
          title: "",
          jobTitle: "  ",
          position: "Platform Engineer",
        },
        ["title", "jobTitle", "position"],
      ),
    ).toBe("Platform Engineer");
  });

  it("returns undefined when no keys match", () => {
    expect(pickFirstValueFromKeys({}, ["title", "jobTitle"])).toBeUndefined();
  });
});
