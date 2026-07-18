import { RejectionDetail } from "../review/review.types";
import { Job, RejectedJob } from "./job.types";

export interface JobRejector {
  reject(job: Job, rejectionReasons: RejectionDetail[]): Promise<RejectedJob>;
}
