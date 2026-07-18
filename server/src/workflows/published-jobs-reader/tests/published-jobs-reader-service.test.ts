import { beforeEach, describe, expect, it } from "vitest";

import {
  CountryCode,
  JobSort,
  SalaryUnit,
} from "../../../domain/job/job.enums";
import { InMemoryJobSearchRepository } from "../../../infrastructure/repositories/in-memory-job-search.repository";
import { InMemoryPublishedJobRepository } from "../../../infrastructure/repositories/in-memory-published-job.repository";
import { createJob } from "../../review/tests/create-job";
import { PublishedJobsReaderService } from "../published-jobs-reader-service";
import { toJobDetail } from "../to-job-detail";
import { toJobSummary } from "../to-job-summary";

describe("PublishedJobsReaderService", () => {
  let publishedJobRepository: InMemoryPublishedJobRepository;
  let jobSearchRepository: InMemoryJobSearchRepository;
  let service: PublishedJobsReaderService;

  beforeEach(() => {
    publishedJobRepository = new InMemoryPublishedJobRepository();
    jobSearchRepository = new InMemoryJobSearchRepository();
    service = new PublishedJobsReaderService(
      publishedJobRepository,
      jobSearchRepository,
    );
  });

  async function publishForSearch(
    job: ReturnType<typeof createJob>,
  ): Promise<void> {
    await publishedJobRepository.save({ job, publishedAt: new Date() });
    await jobSearchRepository.save(toJobSummary(job));
  }

  it("returns all jobs without rawData", async () => {
    const first = createJob({ id: "job-1", title: "Backend Engineer" });
    const second = createJob({ id: "job-2", title: "Frontend Engineer" });
    await publishedJobRepository.save({
      job: first,
      publishedAt: new Date(),
    });
    await publishedJobRepository.save({
      job: second,
      publishedAt: new Date(),
    });

    const result = await service.getAll();

    expect(result).toEqual([toJobDetail(first), toJobDetail(second)]);
    for (const job of result) {
      expect(job).not.toHaveProperty("rawData");
    }
  });

  it("returns job summaries from the search store", async () => {
    const job = createJob({ id: "job-1", title: "Backend Engineer" });
    await publishForSearch(job);

    const result = await service.search({ search: "engineer" });

    expect(result).toEqual([toJobSummary(job)]);
  });

  it("trims search and ignores blank search values", async () => {
    const job = createJob({ id: "job-1", title: "Backend Engineer" });
    await publishForSearch(job);

    await expect(service.search({ search: "  engineer  " })).resolves.toEqual([
      toJobSummary(job),
    ]);
    await expect(service.search({ search: "   " })).resolves.toEqual([
      toJobSummary(job),
    ]);
  });

  it("ignores invalid sort and still returns matching jobs", async () => {
    const job = createJob({ id: "job-1", title: "Backend Engineer" });
    await publishForSearch(job);

    const result = await service.search({
      search: "engineer",
      sort: "invalid_sort",
    });

    expect(result).toEqual([toJobSummary(job)]);
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
    await publishForSearch(usJob);
    await publishForSearch(caJob);

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
    await publishForSearch(usJob);
    await publishForSearch(caJob);

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
    await publishForSearch(low);
    await publishForSearch(high);

    const result = await service.search({
      sort: JobSort.SalaryDescending,
    });

    expect(result.map((job) => job.id)).toEqual(["high", "low"]);
  });

  it("returns a job by id without rawData", async () => {
    const job = createJob({ id: "job-42", title: "Staff Engineer" });
    await publishedJobRepository.save({ job, publishedAt: new Date() });

    const result = await service.getById("job-42");

    expect(result).toEqual(toJobDetail(job));
    expect(result).not.toHaveProperty("rawData");
  });

  it("returns null when job id is missing", async () => {
    await expect(service.getById("missing")).resolves.toBeNull();
  });
});
