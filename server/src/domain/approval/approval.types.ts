import { RejectionReason } from "./approval.enums";

export interface ApprovalDecision {
  approved: boolean;

  rejectionReasons: RejectionReason[];
}
