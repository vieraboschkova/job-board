import { Job } from "../job/job.types";
import { RejectionReason } from "./review.enums";

export interface RejectionDetail {
  reason: RejectionReason;

  details?: string;
}

export interface ReviewResult {
  approved: boolean;

  rejectionReasons: RejectionDetail[];
}

export interface ReviewRule {
  name: string;

  evaluate(job: Job): ReviewResult;
}
