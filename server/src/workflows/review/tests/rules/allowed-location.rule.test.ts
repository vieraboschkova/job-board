import { describe, expect, it } from "vitest";

import { CountryCode } from "../../../../domain/job/job.enums";
import { RejectionReason } from "../../../../domain/review/review.enums";
import { allowedLocationRule } from "../../rules/allowed-location.rule";
import { createJob } from "../create-job";

describe("allowedLocationRule", () => {
  it("approves in-person US jobs", () => {
    expect(allowedLocationRule.evaluate(createJob())).toEqual([]);
  });

  it("approves in-person Canada jobs", () => {
    const reasons = allowedLocationRule.evaluate(
      createJob({ location: { country: CountryCode.CA, remote: false } }),
    );

    expect(reasons).toEqual([]);
  });

  it("approves remote jobs regardless of country", () => {
    const reasons = allowedLocationRule.evaluate(
      createJob({
        location: { country: CountryCode.UK, remote: true },
      }),
    );

    expect(reasons).toEqual([]);
  });

  it("rejects non-remote jobs outside US and Canada", () => {
    const reasons = allowedLocationRule.evaluate(
      createJob({
        location: { country: CountryCode.UK, remote: false },
      }),
    );

    expect(reasons[0]?.reason).toBe(RejectionReason.InvalidLocation);
  });
});
