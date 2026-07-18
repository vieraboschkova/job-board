import { describe, expect, it } from "vitest";

import { CountryCode } from "../../../../domain/job/job.enums";
import { resolveLocation } from "../resolve-location";

describe("resolveLocation", () => {
  it("parses object location", () => {
    expect(
      resolveLocation({
        location: {
          city: "Austin",
          state: "TX",
          country: "USA",
        },
      }),
    ).toEqual({
      city: "Austin",
      country: CountryCode.US,
      remote: false,
    });
  });

  it("parses string location", () => {
    expect(
      resolveLocation({
        location: "Toronto, ON, Canada",
      }),
    ).toEqual({
      city: "Toronto",
      country: CountryCode.CA,
      remote: false,
    });
  });

  it("overrides remote from explicit remote flag", () => {
    expect(
      resolveLocation({
        location: {
          city: "Chicago",
          state: "IL",
          country: "USA",
        },
        remote: true,
      }),
    ).toEqual({
      city: "Chicago",
      country: CountryCode.US,
      remote: true,
    });
  });

  it("returns default location when location is missing", () => {
    expect(resolveLocation({})).toEqual({
      country: CountryCode.Other,
      remote: false,
    });
  });

  it("uses remote flag when location is null", () => {
    expect(
      resolveLocation({
        location: null,
        remote: true,
      }),
    ).toEqual({
      country: CountryCode.Other,
      remote: true,
    });
  });

  it("keeps parsed remote when remote flag is absent", () => {
    expect(
      resolveLocation({
        location: "Remote",
      }),
    ).toEqual({
      country: CountryCode.Other,
      remote: true,
    });
  });
});
