import { CompanyType } from "../../job/job.enums";
import { Job } from "../../job/job.types";
import { RejectionReason } from "../review.enums";
import { RejectionDetail, ReviewRule } from "../review.types";

export const noStaffingFirmRule: ReviewRule = {
  name: "no_staffing_firm",

  evaluate(job: Job): RejectionDetail[] {
    if (job.companyType !== CompanyType.StaffingFirm) {
      return [];
    }

    return [
      {
        reason: RejectionReason.InvalidCompanyType,
        details: "Staffing firm jobs are not allowed",
      },
    ];
  },
};
