import { describe, expect, it } from "vitest";

import { CompanyType } from "../../../../domain/job/job.enums";
import { RejectionReason } from "../../../../domain/review/review.enums";
import { noStaffingFirmRule } from "../../rules/no-staffing-firm.rule";
import { createJob } from "../create-job";

describe("noStaffingFirmRule", () => {
  it("approves direct employers", () => {
    expect(noStaffingFirmRule.evaluate(createJob())).toEqual([]);
  });

  it("approves consulting agencies", () => {
    const reasons = noStaffingFirmRule.evaluate(
      createJob({ companyType: CompanyType.ConsultingAgency }),
    );

    expect(reasons).toEqual([]);
  });

  it("approves unknown company types", () => {
    const reasons = noStaffingFirmRule.evaluate(
      createJob({ companyType: CompanyType.Unknown }),
    );

    expect(reasons).toEqual([]);
  });

  it("rejects staffing firms", () => {
    const reasons = noStaffingFirmRule.evaluate(
      createJob({ companyType: CompanyType.StaffingFirm }),
    );

    expect(reasons[0]?.reason).toBe(RejectionReason.InvalidCompanyType);
  });
});
