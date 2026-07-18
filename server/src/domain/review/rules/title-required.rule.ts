import { Job } from "../../job/job.types";
import { RejectionReason } from "../review.enums";
import { RejectionDetail, ReviewRule } from "../review.types";

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
