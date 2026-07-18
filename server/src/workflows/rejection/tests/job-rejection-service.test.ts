import { beforeEach, describe, expect, it } from "vitest";

import { RejectionReason } from "../../../domain/review/review.enums";
import { InMemoryRejectedJobRepository } from "../../../infrastructure/repositories/in-memory-rejected-job.repository";
import { createJob } from "../../review/tests/create-job";
import { JobRejectionService } from "../job-rejection-service";

describe("JobRejectionService", () => {
  let repository: InMemoryRejectedJobRepository;
  let service: JobRejectionService;

  beforeEach(() => {
    repository = new InMemoryRejectedJobRepository();
    service = new JobRejectionService(repository);
  });

  it("saves the job with rejection reasons and rejectedAt", async () => {
    const job = createJob();
    const rejectionReasons = [
      { reason: RejectionReason.MissingTitle, details: "title empty" },
    ];
    const before = Date.now();

    const rejected = await service.reject(job, rejectionReasons);

    const after = Date.now();
    expect(rejected.job).toEqual(job);
    expect(rejected.rejectionReasons).toEqual(rejectionReasons);
    expect(rejected.rejectedAt.getTime()).toBeGreaterThanOrEqual(before);
    expect(rejected.rejectedAt.getTime()).toBeLessThanOrEqual(after);

    const stored = await repository.getAll();
    expect(stored).toEqual([rejected]);
  });
});
