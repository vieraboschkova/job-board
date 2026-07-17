import { RejectionReason } from "./approval.enums";
import { NormalizedJobPosting } from "../job/job.types";

export interface RejectionDetail {
  reason: RejectionReason;

  details?: string;
}

export interface ApprovalResult {
  approved: boolean;

  rejectionReasons: RejectionDetail[];
}

export interface ApprovalRule {
  name: string;

  evaluate(job: NormalizedJobPosting): ApprovalResult;
}
