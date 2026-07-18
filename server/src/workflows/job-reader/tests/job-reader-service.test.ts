import { beforeEach, describe, expect, it } from "vitest";

import {
  CountryCode,
  JobSort,
  SalaryUnit,
} from "../../../domain/job/job.enums";
import { InMemoryPublishedJobRepository } from "../../../infrastructure/repositories/in-memory-published-job.repository";
import { createJob } from "../../review/tests/create-job";
import { JobReaderService } from "../job-reader-service";

describe("JobReaderService", () => {
  let repository: InMemoryPublishedJobRepository;
  let service: JobReaderService;

  beforeEach(() => {
    repository = new InMemoryPublishedJobRepository();
    service = new JobReaderService(repository);
  });

  it("returns all unwrapped jobs", async () => {
    const first = createJob({ id: "job-1", title: "Backend Engineer" });
    const second = createJob({ id: "job-2", title: "Frontend Engineer" });
    await repository.save({ job: first, publishedAt: new Date() });
    await repository.save({ job: second, publishedAt: new Date() });

    const result = await service.getAll();

    expect(result).toEqual([first, second]);
  });

  it("returns unwrapped Job objects from published jobs", async () => {
    const job = createJob({ id: "job-1", title: "Backend Engineer" });
    await repository.save({ job, publishedAt: new Date("2023-10-03") });

    const result = await service.search({ search: "engineer" });

    expect(result).toEqual([job]);
  });

  it("trims search and ignores blank search values", async () => {
    const job = createJob({ id: "job-1", title: "Backend Engineer" });
    await repository.save({ job, publishedAt: new Date("2023-10-03") });

    await expect(service.search({ search: "  engineer  " })).resolves.toEqual([
      job,
    ]);
    await expect(service.search({ search: "   " })).resolves.toEqual([job]);
  });

  it("ignores invalid sort and still returns matching jobs", async () => {
    const job = createJob({ id: "job-1", title: "Backend Engineer" });
    await repository.save({ job, publishedAt: new Date("2023-10-03") });

    const result = await service.search({
      search: "engineer",
      sort: "invalid_sort",
    });

    expect(result).toEqual([job]);
  });

  it("filters by country when the value is a valid CountryCode", async () => {
    const usJob = createJob({
      id: "us",
      title: "US Engineer",
      location: { country: CountryCode.US, remote: false },
    });
    const caJob = createJob({
      id: "ca",
      title: "CA Engineer",
      location: { country: CountryCode.CA, remote: false },
    });
    await repository.save({ job: usJob, publishedAt: new Date() });
    await repository.save({ job: caJob, publishedAt: new Date() });

    const result = await service.search({ country: CountryCode.US });

    expect(result.map((job) => job.id)).toEqual(["us"]);
  });

  it("ignores invalid country values", async () => {
    const usJob = createJob({
      id: "us",
      title: "US Engineer",
      location: { country: CountryCode.US, remote: false },
    });
    const caJob = createJob({
      id: "ca",
      title: "CA Engineer",
      location: { country: CountryCode.CA, remote: false },
    });
    await repository.save({ job: usJob, publishedAt: new Date() });
    await repository.save({ job: caJob, publishedAt: new Date() });

    const result = await service.search({ country: "XX" });

    expect(result.map((job) => job.id)).toEqual(["us", "ca"]);
  });

  it("applies a valid sort", async () => {
    const low = createJob({
      id: "low",
      title: "A",
      salary: { min: 110000, currency: "USD", unit: SalaryUnit.Annual },
    });
    const high = createJob({
      id: "high",
      title: "B",
      salary: { min: 160000, currency: "USD", unit: SalaryUnit.Annual },
    });
    await repository.save({ job: low, publishedAt: new Date() });
    await repository.save({ job: high, publishedAt: new Date() });

    const result = await service.search({
      sort: JobSort.SalaryDescending,
    });

    expect(result.map((job) => job.id)).toEqual(["high", "low"]);
  });

  it("returns a job by id", async () => {
    const job = createJob({ id: "job-42", title: "Staff Engineer" });
    await repository.save({ job, publishedAt: new Date() });

    await expect(service.getById("job-42")).resolves.toEqual(job);
  });

  it("returns null when job id is missing", async () => {
    await expect(service.getById("missing")).resolves.toBeNull();
  });
});
