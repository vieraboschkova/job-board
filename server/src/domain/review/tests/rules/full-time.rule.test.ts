import { describe, expect, it } from "vitest";

import { EmploymentType } from "../../../job/job.enums";
import { RejectionReason } from "../../review.enums";
import { fullTimeRule } from "../../rules/full-time.rule";
import { createJob } from "../create-job";

describe("fullTimeRule", () => {
  it("approves full-time jobs", () => {
    expect(fullTimeRule.evaluate(createJob())).toEqual([]);
  });

  it.each([
    EmploymentType.PartTime,
    EmploymentType.Contract,
    EmploymentType.Internship,
    EmploymentType.Unknown,
  ])("rejects %s jobs", (employmentType) => {
    const reasons = fullTimeRule.evaluate(createJob({ employmentType }));

    expect(reasons[0]?.reason).toBe(RejectionReason.InvalidEmploymentType);
  });
});
