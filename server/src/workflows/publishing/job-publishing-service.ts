import { PublishedJobRepository } from "../../domain/job/job.repository";
import { Job, PublishedJob } from "../../domain/job/job.types";
import { JobPublisher } from "../../domain/job/publishing.types";

export class JobPublishingService implements JobPublisher {
  constructor(
    private readonly publishedJobRepository: PublishedJobRepository,
  ) {}

  async publish(job: Job): Promise<PublishedJob> {
    return this.publishedJobRepository.save({
      job,
      publishedAt: new Date(),
    });
  }
}
