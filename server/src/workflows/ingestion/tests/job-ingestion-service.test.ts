import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  JobNormalizer,
  RawJobPosting,
} from "../../../domain/ingestion/ingestion.types";
import { JobPublisher } from "../../../domain/job/publishing.types";
import { JobRejector } from "../../../domain/job/rejection.types";
import { Job } from "../../../domain/job/job.types";
import { RejectionReason } from "../../../domain/review/review.enums";
import { ReviewEngine } from "../../../domain/review/review.types";
import { InMemoryPublishedJobRepository } from "../../../infrastructure/repositories/in-memory-published-job.repository";
import { InMemoryRejectedJobRepository } from "../../../infrastructure/repositories/in-memory-rejected-job.repository";
import { logger } from "../../../shared/logger";
import exampleJobs from "../../../tests/mock/exampleJobs.json";
import { DefaultJobNormalizer } from "../../normalization/default-job-normalizer";
import { JobPublishingService } from "../../publishing/job-publishing-service";
import { JobRejectionService } from "../../rejection/job-rejection-service";
import { DefaultReviewEngine } from "../../review/default-review-engine";
import { JobIngestionService } from "../job-ingestion-service";

const GENERIC_INGESTION_ERROR = "Failed to process record";

describe("JobIngestionService", () => {
  let publishedJobRepository: InMemoryPublishedJobRepository;
  let rejectedJobRepository: InMemoryRejectedJobRepository;
  let service: JobIngestionService;
  let logError: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    logError = vi.spyOn(logger, "error").mockImplementation(() => {});
    publishedJobRepository = new InMemoryPublishedJobRepository();
    rejectedJobRepository = new InMemoryRejectedJobRepository();
    service = new JobIngestionService(
      new DefaultJobNormalizer(),
      new DefaultReviewEngine(),
      new JobPublishingService(publishedJobRepository),
      new JobRejectionService(rejectedJobRepository),
    );
  });

  afterEach(() => {
    logError.mockRestore();
  });

  it("returns zero counts for an empty batch", async () => {
    const result = await service.ingest([], "empty-feed");

    expect(result).toEqual({
      receivedCount: 0,
      normalizedCount: 0,
      approvedCount: 0,
      rejectedCount: 0,
      errors: [],
    });
    expect(await publishedJobRepository.getAll()).toHaveLength(0);
    expect(await rejectedJobRepository.getAll()).toHaveLength(0);
  });

  it("approves and rejects jobs in a mixed batch", async () => {
    const rawJobs = [
      exampleJobs[0] as RawJobPosting,
      exampleJobs[1] as RawJobPosting,
    ];

    const result = await service.ingest(rawJobs, "mixed-feed");

    expect(result).toEqual({
      receivedCount: 2,
      normalizedCount: 2,
      approvedCount: 1,
      rejectedCount: 1,
      errors: [],
    });

    const published = await publishedJobRepository.getAll();
    expect(published).toHaveLength(1);
    expect(published[0].job.title).toBe("Backend Engineer");
    expect(published[0].job.sourceName).toBe("mixed-feed");
    expect(published[0].publishedAt).toBeInstanceOf(Date);

    const rejected = await rejectedJobRepository.getAll();
    expect(rejected).toHaveLength(1);
    expect(rejected[0].job.title).toBe("Frontend Developer Intern");
    expect(rejected[0].rejectedAt).toBeInstanceOf(Date);
    expect(rejected[0].rejectionReasons.map((r) => r.reason)).toEqual(
      expect.arrayContaining([
        RejectionReason.InvalidEmploymentType,
        RejectionReason.InvalidSalary,
        RejectionReason.InvalidCompanyType,
      ]),
    );
  });

  it("continues the batch when one record throws", async () => {
    const malformedError = new Error("malformed record");
    const throwingNormalizer: JobNormalizer = {
      normalize(rawJob: RawJobPosting, sourceName: string): Job {
        if (rawJob.fail === true) {
          throw malformedError;
        }
        return new DefaultJobNormalizer().normalize(rawJob, sourceName);
      },
    };

    service = new JobIngestionService(
      throwingNormalizer,
      new DefaultReviewEngine(),
      new JobPublishingService(publishedJobRepository),
      new JobRejectionService(rejectedJobRepository),
    );

    const result = await service.ingest(
      [
        exampleJobs[0] as RawJobPosting,
        { fail: true },
        exampleJobs[1] as RawJobPosting,
      ],
      "error-feed",
    );

    expect(result.receivedCount).toBe(3);
    expect(result.normalizedCount).toBe(2);
    expect(result.approvedCount).toBe(1);
    expect(result.rejectedCount).toBe(1);
    expect(result.errors).toEqual([
      { index: 1, message: GENERIC_INGESTION_ERROR },
    ]);
    expect(logError).toHaveBeenCalledWith(
      "Failed to process ingestion record",
      {
        index: 1,
        sourceName: "error-feed",
        error: malformedError,
      },
    );
    expect(await publishedJobRepository.getAll()).toHaveLength(1);
    expect(await rejectedJobRepository.getAll()).toHaveLength(1);
  });

  it("counts normalize but not approve when publish fails", async () => {
    const failingPublisher: JobPublisher = {
      publish: async () => {
        throw new Error("publish storage failed");
      },
    };

    service = new JobIngestionService(
      new DefaultJobNormalizer(),
      new DefaultReviewEngine(),
      failingPublisher,
      new JobRejectionService(rejectedJobRepository),
    );

    const result = await service.ingest(
      [exampleJobs[0] as RawJobPosting],
      "publish-fail-feed",
    );

    expect(result).toEqual({
      receivedCount: 1,
      normalizedCount: 1,
      approvedCount: 0,
      rejectedCount: 0,
      errors: [{ index: 0, message: GENERIC_INGESTION_ERROR }],
    });
    expect(await publishedJobRepository.getAll()).toHaveLength(0);
    expect(await rejectedJobRepository.getAll()).toHaveLength(0);
  });

  it("counts normalize but not reject when reject fails", async () => {
    const failingRejector: JobRejector = {
      reject: async () => {
        throw new Error("reject storage failed");
      },
    };

    service = new JobIngestionService(
      new DefaultJobNormalizer(),
      new DefaultReviewEngine(),
      new JobPublishingService(publishedJobRepository),
      failingRejector,
    );

    const result = await service.ingest(
      [exampleJobs[1] as RawJobPosting],
      "reject-fail-feed",
    );

    expect(result).toEqual({
      receivedCount: 1,
      normalizedCount: 1,
      approvedCount: 0,
      rejectedCount: 0,
      errors: [{ index: 0, message: GENERIC_INGESTION_ERROR }],
    });
    expect(await publishedJobRepository.getAll()).toHaveLength(0);
    expect(await rejectedJobRepository.getAll()).toHaveLength(0);
  });

  it("records a generic error when review throws", async () => {
    const throwingReview: ReviewEngine = {
      review() {
        throw new Error("review exploded");
      },
    };

    service = new JobIngestionService(
      new DefaultJobNormalizer(),
      throwingReview,
      new JobPublishingService(publishedJobRepository),
      new JobRejectionService(rejectedJobRepository),
    );

    const result = await service.ingest(
      [exampleJobs[0] as RawJobPosting],
      "review-fail-feed",
    );

    expect(result).toEqual({
      receivedCount: 1,
      normalizedCount: 1,
      approvedCount: 0,
      rejectedCount: 0,
      errors: [{ index: 0, message: GENERIC_INGESTION_ERROR }],
    });
  });
});
