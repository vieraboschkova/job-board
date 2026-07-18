import {
  IngestionError,
  IngestionResult,
  JobIngester,
  JobNormalizer,
  RawJobPosting,
} from "../../domain/ingestion/ingestion.types";
import { JobPublisher } from "../../domain/job/publishing.types";
import { JobRejector } from "../../domain/job/rejection.types";
import { ReviewEngine } from "../../domain/review/review.types";
import { logger } from "../../shared/logger";

export class JobIngestionService implements JobIngester {
  constructor(
    private readonly normalizer: JobNormalizer,
    private readonly reviewEngine: ReviewEngine,
    private readonly publisher: JobPublisher,
    private readonly rejector: JobRejector,
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
      duplicatesCount: 0,
      duplicates: [],
      errors: [],
    };

    for (const [index, rawJob] of rawJobs.entries()) {
      try {
        await this.ingestOne(rawJob, sourceName, result);
      } catch (error) {
        logger.error("Failed to process ingestion record", {
          index,
          sourceName,
          error,
        });
        result.errors.push(toIngestionError(index));
      }
    }

    if (result.duplicates.length > 0) {
      logger.info("Ingestion duplicates", {
        sourceName,
        duplicatesCount: result.duplicatesCount,
        duplicates: result.duplicates,
      });
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
      const outcome = await this.publisher.publish(job);
      if (outcome.status === "duplicate") {
        result.duplicates.push({
          sourceName: job.sourceName,
          id: outcome.publishedJob.job.id,
          sourceId: job.sourceId,
        });
        result.duplicatesCount += 1;
        return;
      }

      result.approvedCount += 1;
      return;
    }

    await this.rejector.reject(job, rejectionReasons);
    result.rejectedCount += 1;
  }
}

function toIngestionError(index: number): IngestionError {
  return {
    index,
    message: "Failed to process record",
  };
}
