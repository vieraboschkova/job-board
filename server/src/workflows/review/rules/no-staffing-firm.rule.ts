import { CompanyType } from "../../../domain/job/job.enums";
import { Job } from "../../../domain/job/job.types";
import { RejectionReason } from "../../../domain/review/review.enums";
import {
  RejectionDetail,
  ReviewRule,
} from "../../../domain/review/review.types";

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
