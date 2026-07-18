import {
  JobSearchRepository,
  PublishedJobRepository,
} from "../../domain/job/job.repository";
import { Job } from "../../domain/job/job.types";
import {
  JobPublisher,
  PublishOutcome,
} from "../../domain/job/publishing.types";
import { logger } from "../../shared/logger";
import { toJobSummary } from "../published-jobs-reader/to-job-summary";

export class JobPublishingService implements JobPublisher {
  constructor(
    private readonly publishedJobRepository: PublishedJobRepository,
    private readonly jobSearchRepository: JobSearchRepository,
  ) {}

  async publish(job: Job): Promise<PublishOutcome> {
    const existing = await this.findExisting(job);
    if (existing) {
      return { status: "duplicate", publishedJob: existing };
    }

    const publishedJob = await this.publishedJobRepository.save({
      job,
      publishedAt: new Date(),
    });

    try {
      await this.jobSearchRepository.save(toJobSummary(job));
    } catch (error) {
      logger.error("Failed to index published job for search", {
        id: job.id,
        sourceName: job.sourceName,
        sourceId: job.sourceId,
        error,
      });
      throw error;
    }

    return { status: "created", publishedJob };
  }

  private async findExisting(job: Job) {
    const byId = await this.publishedJobRepository.getById(job.id);
    if (byId) {
      return byId;
    }

    if (job.sourceId) {
      return this.publishedJobRepository.findBySource(
        job.sourceName,
        job.sourceId,
      );
    }

    return null;
  }
}
