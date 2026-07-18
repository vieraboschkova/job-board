import { beforeEach, describe, expect, it, vi } from "vitest";

import { InMemoryJobSearchRepository } from "../../../infrastructure/repositories/in-memory-job-search.repository";
import { InMemoryPublishedJobRepository } from "../../../infrastructure/repositories/in-memory-published-job.repository";
import { logger } from "../../../shared/logger";
import { createJob } from "../../review/tests/create-job";
import { toJobSummary } from "../../published-jobs-reader/to-job-summary";
import { JobPublishingService } from "../job-publishing-service";

describe("JobPublishingService", () => {
  let publishedJobRepository: InMemoryPublishedJobRepository;
  let jobSearchRepository: InMemoryJobSearchRepository;
  let service: JobPublishingService;

  beforeEach(() => {
    publishedJobRepository = new InMemoryPublishedJobRepository();
    jobSearchRepository = new InMemoryJobSearchRepository();
    service = new JobPublishingService(
      publishedJobRepository,
      jobSearchRepository,
    );
  });

  it("saves the job with a publishedAt timestamp and indexes a summary", async () => {
    const job = createJob({ sourceId: "src-1" });
    const before = Date.now();

    const outcome = await service.publish(job);

    const after = Date.now();
    expect(outcome.status).toBe("created");
    if (outcome.status !== "created") {
      return;
    }
    expect(outcome.publishedJob.job).toEqual(job);
    expect(outcome.publishedJob.publishedAt.getTime()).toBeGreaterThanOrEqual(
      before,
    );
    expect(outcome.publishedJob.publishedAt.getTime()).toBeLessThanOrEqual(
      after,
    );

    expect(await publishedJobRepository.getAll()).toEqual([
      outcome.publishedJob,
    ]);
    expect(await jobSearchRepository.search({})).toEqual([toJobSummary(job)]);
  });

  it("returns duplicate when sourceName and sourceId match without writing search", async () => {
    const first = createJob({
      id: "job-1",
      sourceName: "feed-a",
      sourceId: "ext-1",
    });
    const second = createJob({
      id: "job-2",
      sourceName: "feed-a",
      sourceId: "ext-1",
      title: "Different title",
    });

    const created = await service.publish(first);
    const duplicate = await service.publish(second);

    expect(created.status).toBe("created");
    expect(duplicate).toEqual({
      status: "duplicate",
      publishedJob:
        created.status === "created" ? created.publishedJob : undefined,
    });
    expect(await publishedJobRepository.getAll()).toHaveLength(1);
    expect(await jobSearchRepository.search({})).toEqual([toJobSummary(first)]);
  });

  it("returns duplicate when our id matches without writing search", async () => {
    const job = createJob({ id: "same-id", sourceId: undefined });

    const created = await service.publish(job);
    const duplicate = await service.publish({ ...job, title: "Changed" });

    expect(created.status).toBe("created");
    expect(duplicate.status).toBe("duplicate");
    expect(await publishedJobRepository.getAll()).toHaveLength(1);
    expect(await jobSearchRepository.search({})).toHaveLength(1);
  });

  it("publishes both when sourceName differs", async () => {
    const first = createJob({
      id: "job-1",
      sourceName: "feed-a",
      sourceId: "ext-1",
    });
    const second = createJob({
      id: "job-2",
      sourceName: "feed-b",
      sourceId: "ext-1",
    });

    await service.publish(first);
    const outcome = await service.publish(second);

    expect(outcome.status).toBe("created");
    expect(await publishedJobRepository.getAll()).toHaveLength(2);
    expect(await jobSearchRepository.search({})).toHaveLength(2);
  });

  it("publishes both when sourceId is missing", async () => {
    const first = createJob({ id: "job-1", sourceId: undefined });
    const second = createJob({ id: "job-2", sourceId: undefined });

    await service.publish(first);
    const outcome = await service.publish(second);

    expect(outcome.status).toBe("created");
    expect(await publishedJobRepository.getAll()).toHaveLength(2);
    expect(await jobSearchRepository.search({})).toHaveLength(2);
  });

  it("logs and rethrows when search indexing fails after publish", async () => {
    const job = createJob({ sourceId: "src-1" });
    const logError = vi.spyOn(logger, "error").mockImplementation(() => {});
    vi.spyOn(jobSearchRepository, "save").mockRejectedValue(
      new Error("index down"),
    );

    await expect(service.publish(job)).rejects.toThrow("index down");

    expect(await publishedJobRepository.getAll()).toHaveLength(1);
    expect(logError).toHaveBeenCalledWith(
      "Failed to index published job for search",
      expect.objectContaining({
        id: job.id,
        sourceName: job.sourceName,
        sourceId: job.sourceId,
      }),
    );

    logError.mockRestore();
  });
});
