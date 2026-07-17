import { describe, expect, it } from "vitest";
import { CountryCode } from "../../../../domain/job/job.enums";
import { parseLocation } from "../parse-location";

describe("parseLocation", () => {
  it("parses location object", () => {
    expect(
      parseLocation({
        city: "Austin",
        state: "TX",
        country: "USA",
      }),
    ).toEqual({
      city: "Austin",
      country: CountryCode.US,
      remote: false,
    });
  });

  it("parses comma separated location", () => {
    expect(parseLocation("New York, NY, USA")).toEqual({
      city: "New York",
      country: CountryCode.US,
      remote: false,
    });
  });

  it("parses Canada location", () => {
    expect(parseLocation("Toronto, ON, Canada")).toEqual({
      city: "Toronto",
      country: CountryCode.CA,
      remote: false,
    });
  });

  it("parses remote location", () => {
    expect(parseLocation("Remote")).toEqual({
      country: CountryCode.Other,
      remote: true,
    });
  });

  it("trims whitespace", () => {
    expect(parseLocation("  Berlin, Germany ")).toEqual({
      city: "Berlin",
      country: CountryCode.Other,
      remote: false,
    });
  });

  it("returns undefined for empty value", () => {
    expect(parseLocation("")).toBeUndefined();
  });

  it("returns undefined for invalid value", () => {
    expect(parseLocation(123)).toBeUndefined();
  });
});
