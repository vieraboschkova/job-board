import { JobIngestionService } from "./domain/ingestion/ingestion.types";
import {
  PublishedJobRepository,
  RejectedJobRepository,
} from "./domain/job/job.repository";
import { InMemoryPublishedJobRepository } from "./infrastructure/repositories/in-memory-published-job.repository";
import { InMemoryRejectedJobRepository } from "./infrastructure/repositories/in-memory-rejected-job.repository";
import { DefaultJobIngestionService } from "./workflows/ingestion/default-job-ingestion-service";
import { DefaultJobNormalizer } from "./workflows/normalization/default-job-normalizer";
import { DefaultReviewEngine } from "./workflows/review/default-review-engine";

export interface AppDependencies {
  ingestionService: JobIngestionService;
  publishedJobRepository: PublishedJobRepository;
  rejectedJobRepository: RejectedJobRepository;
}

export function createDefaultDependencies(): AppDependencies {
  const publishedJobRepository = new InMemoryPublishedJobRepository();
  const rejectedJobRepository = new InMemoryRejectedJobRepository();

  return {
    publishedJobRepository,
    rejectedJobRepository,
    ingestionService: new DefaultJobIngestionService(
      new DefaultJobNormalizer(),
      new DefaultReviewEngine(),
      publishedJobRepository,
      rejectedJobRepository,
    ),
  };
}
