import { beforeEach, describe, expect, it } from "vitest";

import {
  JobNormalizer,
  RawJobPosting,
} from "../../../domain/ingestion/ingestion.types";
import {
  PublishedJobRepository,
  RejectedJobRepository,
} from "../../../domain/job/job.repository";
import { Job } from "../../../domain/job/job.types";
import { RejectionReason } from "../../../domain/review/review.enums";
import { ReviewEngine } from "../../../domain/review/review.types";
import { InMemoryPublishedJobRepository } from "../../../infrastructure/repositories/in-memory-published-job.repository";
import { InMemoryRejectedJobRepository } from "../../../infrastructure/repositories/in-memory-rejected-job.repository";
import exampleJobs from "../../../tests/mock/exampleJobs.json";
import { DefaultJobNormalizer } from "../../normalization/default-job-normalizer";
import { DefaultReviewEngine } from "../../review/default-review-engine";
import { DefaultJobIngestionService } from "../default-job-ingestion-service";

const GENERIC_INGESTION_ERROR = "Failed to process record";

describe("DefaultJobIngestionService", () => {
  let publishedJobRepository: InMemoryPublishedJobRepository;
  let rejectedJobRepository: InMemoryRejectedJobRepository;
  let service: DefaultJobIngestionService;

  beforeEach(() => {
    publishedJobRepository = new InMemoryPublishedJobRepository();
    rejectedJobRepository = new InMemoryRejectedJobRepository();
    service = new DefaultJobIngestionService(
      new DefaultJobNormalizer(),
      new DefaultReviewEngine(),
      publishedJobRepository,
      rejectedJobRepository,
    );
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
    const throwingNormalizer: JobNormalizer = {
      normalize(rawJob: RawJobPosting, sourceName: string): Job {
        if (rawJob.fail === true) {
          throw new Error("malformed record");
        }
        return new DefaultJobNormalizer().normalize(rawJob, sourceName);
      },
    };

    service = new DefaultJobIngestionService(
      throwingNormalizer,
      new DefaultReviewEngine(),
      publishedJobRepository,
      rejectedJobRepository,
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
    expect(await publishedJobRepository.getAll()).toHaveLength(1);
    expect(await rejectedJobRepository.getAll()).toHaveLength(1);
  });

  it("counts normalize but not approve when publish save fails", async () => {
    const failingPublished: PublishedJobRepository = {
      save: async () => {
        throw new Error("publish storage failed");
      },
      getAll: () => publishedJobRepository.getAll(),
      getById: (id) => publishedJobRepository.getById(id),
      search: (query) => publishedJobRepository.search(query),
    };

    service = new DefaultJobIngestionService(
      new DefaultJobNormalizer(),
      new DefaultReviewEngine(),
      failingPublished,
      rejectedJobRepository,
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

  it("counts normalize but not reject when reject save fails", async () => {
    const failingRejected: RejectedJobRepository = {
      save: async () => {
        throw new Error("reject storage failed");
      },
      getAll: () => rejectedJobRepository.getAll(),
      getById: (id) => rejectedJobRepository.getById(id),
      getCount: () => rejectedJobRepository.getCount(),
    };

    service = new DefaultJobIngestionService(
      new DefaultJobNormalizer(),
      new DefaultReviewEngine(),
      publishedJobRepository,
      failingRejected,
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

    service = new DefaultJobIngestionService(
      new DefaultJobNormalizer(),
      throwingReview,
      publishedJobRepository,
      rejectedJobRepository,
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
