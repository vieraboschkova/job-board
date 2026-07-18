import { Job } from "../../domain/job/job.types";
import {
  ReviewDecision,
  ReviewEngine,
  ReviewRule,
} from "../../domain/review/review.types";
import { defaultRules } from "./rules";

export class DefaultReviewEngine implements ReviewEngine {
  constructor(private readonly rules: ReviewRule[] = [...defaultRules]) {}

  review(job: Job): ReviewDecision {
    const rejectionReasons = this.rules.flatMap((rule) => rule.evaluate(job));

    return {
      approved: rejectionReasons.length === 0,
      rejectionReasons,
    };
  }
}
