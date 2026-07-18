import {
  IngestionError,
  IngestionResult,
  JobIngestionService,
  JobNormalizer,
  RawJobPosting,
} from "../../domain/ingestion/ingestion.types";
import {
  PublishedJobRepository,
  RejectedJobRepository,
} from "../../domain/job/job.repository";
import { Job } from "../../domain/job/job.types";
import {
  RejectionDetail,
  ReviewEngine,
} from "../../domain/review/review.types";

export class DefaultJobIngestionService implements JobIngestionService {
  constructor(
    private readonly normalizer: JobNormalizer,
    private readonly reviewEngine: ReviewEngine,
    private readonly publishedJobRepository: PublishedJobRepository,
    private readonly rejectedJobRepository: RejectedJobRepository,
  ) {}

  async ingest(
    rawJobs: RawJobPosting[],
    sourceName: string,
  ): Promise<IngestionResult> {
    const result: IngestionResult = {
      receivedCount: rawJobs.length,
      normalizedCount: 0,
      approvedCount: 0,
      rejectedCount: 0,
      errors: [],
    };

    for (const [index, rawJob] of rawJobs.entries()) {
      try {
        await this.ingestOne(rawJob, sourceName, result);
      } catch {
        result.errors.push(toIngestionError(index));
      }
    }

    return result;
  }

  private async ingestOne(
    rawJob: RawJobPosting,
    sourceName: string,
    result: IngestionResult,
  ): Promise<void> {
    const job = this.normalizer.normalize(rawJob, sourceName);
    result.normalizedCount += 1;

    const { approved, rejectionReasons } = this.reviewEngine.review(job);

    if (approved) {
      await this.publish(job);
      result.approvedCount += 1;
      return;
    }

    await this.reject(job, rejectionReasons);
    result.rejectedCount += 1;
  }

  private async publish(job: Job): Promise<void> {
    await this.publishedJobRepository.save({
      job,
      publishedAt: new Date(),
    });
  }

  private async reject(
    job: Job,
    rejectionReasons: RejectionDetail[],
  ): Promise<void> {
    await this.rejectedJobRepository.save({
      job,
      rejectedAt: new Date(),
      rejectionReasons,
    });
  }
}

function toIngestionError(index: number): IngestionError {
  return {
    index,
    message: "Failed to process record",
  };
}
