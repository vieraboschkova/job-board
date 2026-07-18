import { JobIngester } from "./domain/ingestion/ingestion.types";
import {
  PublishedJobRepository,
  RejectedJobRepository,
} from "./domain/job/job.repository";
import { JobReader } from "./domain/job/job.types";
import { InMemoryPublishedJobRepository } from "./infrastructure/repositories/in-memory-published-job.repository";
import { InMemoryRejectedJobRepository } from "./infrastructure/repositories/in-memory-rejected-job.repository";
import { JobIngestionService } from "./workflows/ingestion/job-ingestion-service";
import { DefaultJobNormalizer } from "./workflows/normalization/default-job-normalizer";
import { JobPublishingService } from "./workflows/publishing/job-publishing-service";
import { JobRejectionService } from "./workflows/rejection/job-rejection-service";
import { DefaultReviewEngine } from "./workflows/review/default-review-engine";
import { JobReaderService } from "./workflows/job-reader/job-reader-service";

export interface AppDependencies {
  ingestionService: JobIngester;
  jobReader: JobReader;
  publishedJobRepository: PublishedJobRepository;
  rejectedJobRepository: RejectedJobRepository;
}

export function createDefaultDependencies(): AppDependencies {
  const publishedJobRepository = new InMemoryPublishedJobRepository();
  const rejectedJobRepository = new InMemoryRejectedJobRepository();

  return {
    publishedJobRepository,
    rejectedJobRepository,
    ingestionService: new JobIngestionService(
      new DefaultJobNormalizer(),
      new DefaultReviewEngine(),
      new JobPublishingService(publishedJobRepository),
      new JobRejectionService(rejectedJobRepository),
    ),
    jobReader: new JobReaderService(publishedJobRepository),
  };
}
