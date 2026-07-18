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
    const job = createJob();
    const before = Date.now();

    const published = await service.publish(job);

    const after = Date.now();
    expect(published.job).toEqual(job);
    expect(published.publishedAt.getTime()).toBeGreaterThanOrEqual(before);
    expect(published.publishedAt.getTime()).toBeLessThanOrEqual(after);

    const stored = await repository.getAll();
    expect(stored).toEqual([published]);
  });
});
