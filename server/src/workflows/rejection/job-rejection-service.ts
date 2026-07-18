import { RejectedJobRepository } from "../../domain/job/job.repository";
import { Job, RejectedJob } from "../../domain/job/job.types";
import { JobRejector } from "../../domain/job/rejection.types";
import { RejectionDetail } from "../../domain/review/review.types";

export class JobRejectionService implements JobRejector {
  constructor(private readonly rejectedJobRepository: RejectedJobRepository) {}

  async reject(
    job: Job,
    rejectionReasons: RejectionDetail[],
  ): Promise<RejectedJob> {
    return this.rejectedJobRepository.save({
      job,
      rejectedAt: new Date(),
      rejectionReasons,
    });
  }
}
