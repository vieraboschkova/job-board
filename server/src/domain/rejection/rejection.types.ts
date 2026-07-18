import { Job, RejectedJob } from "../job/job.types";
import { RejectionDetail } from "../review/review.types";

export interface JobRejectionService {
  reject(job: Job, rejectionReasons: RejectionDetail[]): Promise<RejectedJob>;
}
