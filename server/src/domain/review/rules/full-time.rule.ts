import { EmploymentType } from "../../job/job.enums";
import { Job } from "../../job/job.types";
import { RejectionReason } from "../review.enums";
import { RejectionDetail, ReviewRule } from "../review.types";

export const fullTimeRule: ReviewRule = {
  name: "full_time_only",

  evaluate(job: Job): RejectionDetail[] {
    if (job.employmentType === EmploymentType.FullTime) {
      return [];
    }

    return [
      {
        reason: RejectionReason.InvalidEmploymentType,
        details: "Job must be full-time",
      },
    ];
  },
};
