import { PublishedJobRepository } from "../../domain/job/job.repository";
import { Job } from "../../domain/job/job.types";
import {
  JobPublisher,
  PublishOutcome,
} from "../../domain/job/publishing.types";

export class JobPublishingService implements JobPublisher {
  constructor(
    private readonly publishedJobRepository: PublishedJobRepository,
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
