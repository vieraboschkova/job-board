import { RejectedJobRepository } from "../../domain/job/job.repository";
import { Job, RejectedJob } from "../../domain/job/job.types";
import { JobRejector } from "../../domain/job/rejection.types";
import { RejectionDetail } from "../../domain/review/review.types";
import { logger } from "../../shared/logger";

export class JobRejectionService implements JobRejector {
  constructor(private readonly rejectedJobRepository: RejectedJobRepository) {}

  async reject(
    job: Job,
    rejectionReasons: RejectionDetail[],
  ): Promise<RejectedJob> {
    const rejected = await this.rejectedJobRepository.save({
      job,
      rejectedAt: new Date(),
      rejectionReasons,
    });

    logger.info("Job rejected", {
      jobId: job.id,
      sourceName: job.sourceName,
      reasons: rejectionReasons.map((reason) => reason.reason),
    });

    return rejected;
  }
}
