import { Job } from "../job/job.types";
import { RejectionReason } from "./review.enums";

export interface RejectionDetail {
  reason: RejectionReason;

  details?: string;
}

export interface ReviewRule {
  name: string;

  evaluate(job: Job): RejectionDetail[];
}

export interface ReviewDecision {
  approved: boolean;

  rejectionReasons: RejectionDetail[];
}

export interface ReviewEngine {
  review(job: Job): ReviewDecision;
}
