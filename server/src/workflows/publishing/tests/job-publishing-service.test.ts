import { beforeEach, describe, expect, it } from "vitest";

import { InMemoryPublishedJobRepository } from "../../../infrastructure/repositories/in-memory-published-job.repository";
import { createJob } from "../../review/tests/create-job";
import { JobPublishingService } from "../job-publishing-service";

describe("JobPublishingService", () => {
  let repository: InMemoryPublishedJobRepository;
  let service: JobPublishingService;

  beforeEach(() => {
    repository = new InMemoryPublishedJobRepository();
    service = new JobPublishingService(repository);
  });

  it("saves the job with a publishedAt timestamp", async () => {
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

    const stored = await repository.getAll();
    expect(stored).toEqual([outcome.publishedJob]);
  });

  it("returns duplicate when sourceName and sourceId match", async () => {
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
    expect(await repository.getAll()).toHaveLength(1);
  });

  it("returns duplicate when our id matches", async () => {
    const job = createJob({ id: "same-id", sourceId: undefined });

    const created = await service.publish(job);
    const duplicate = await service.publish({ ...job, title: "Changed" });

    expect(created.status).toBe("created");
    expect(duplicate.status).toBe("duplicate");
    expect(await repository.getAll()).toHaveLength(1);
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
    expect(await repository.getAll()).toHaveLength(2);
  });

  it("publishes both when sourceId is missing", async () => {
    const first = createJob({ id: "job-1", sourceId: undefined });
    const second = createJob({ id: "job-2", sourceId: undefined });

    await service.publish(first);
    const outcome = await service.publish(second);

    expect(outcome.status).toBe("created");
    expect(await repository.getAll()).toHaveLength(2);
  });
});
