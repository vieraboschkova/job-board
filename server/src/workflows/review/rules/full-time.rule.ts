import { EmploymentType } from "../../../domain/job/job.enums";
import { Job } from "../../../domain/job/job.types";
import { RejectionReason } from "../../../domain/review/review.enums";
import {
  RejectionDetail,
  ReviewRule,
} from "../../../domain/review/review.types";

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
