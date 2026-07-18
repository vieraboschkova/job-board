import { describe, expect, it } from "vitest";

import { parseCompany } from "../parse-company";

describe("parseCompany", () => {
  it("parses company field", () => {
    expect(parseCompany({ company: "NextGen Systems" })).toBe(
      "NextGen Systems",
    );
  });

  it("falls back to companyName", () => {
    expect(parseCompany({ companyName: "MetricMind" })).toBe("MetricMind");
  });

  it("parses nested employer name", () => {
    expect(
      parseCompany({
        employer: {
          name: "Orbit Global",
        },
      }),
    ).toBe("Orbit Global");
  });

  it("parses nested employer companyName", () => {
    expect(
      parseCompany({
        employer: {
          companyName: "AppForge",
        },
      }),
    ).toBe("AppForge");
  });

  it("prefers top-level company over nested employer", () => {
    expect(
      parseCompany({
        company: "Primary Company",
        employer: {
          name: "Nested Employer",
        },
      }),
    ).toBe("Primary Company");
  });

  it("returns undefined for blank company", () => {
    expect(parseCompany({ company: "  " })).toBeUndefined();
  });

  it("returns undefined for invalid employer value", () => {
    expect(parseCompany({ employer: "not-an-object" })).toBeUndefined();
  });

  it("returns undefined when company fields are missing", () => {
    expect(parseCompany({})).toBeUndefined();
  });
});
