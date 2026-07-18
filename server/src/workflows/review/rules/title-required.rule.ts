import { Job } from "../../../domain/job/job.types";
import { RejectionReason } from "../../../domain/review/review.enums";
import {
  RejectionDetail,
  ReviewRule,
} from "../../../domain/review/review.types";

export const titleRequiredRule: ReviewRule = {
  name: "title_required",

  evaluate(job: Job): RejectionDetail[] {
    if (job.title.trim().length > 0) {
      return [];
    }

    return [
      {
        reason: RejectionReason.MissingTitle,
        details: "Title is required",
      },
    ];
  },
};
