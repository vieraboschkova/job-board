import { beforeEach, describe, expect, it } from "vitest";

import { InMemoryPublishedJobRepository } from "../in-memory-published-job.repository";

import {
  CompanyType,
  CountryCode,
  EmploymentType,
  Language,
  SalaryUnit,
} from "../../../domain/job/job.enums";

import { Job, PublishedJob } from "../../../domain/job/job.types";

const createPublishedJob = (
  id = "1",
  jobOverrides?: Partial<Job>,
): PublishedJob => ({
  job: {
    id,
    title: "Frontend Developer",
    company: "Acme",
    description: "React job",
    language: Language.English,
    location: {
      country: CountryCode.US,
      city: "New York",
      remote: true,
    },
    salary: {
      min: 80000,
      max: 100000,
      currency: "USD",
      unit: SalaryUnit.Annual,
    },
    employmentType: EmploymentType.FullTime,
    companyType: CompanyType.DirectEmployer,
    sourceName: "test",
    rawData: {},
    postedAt: new Date("2026-01-01"),
    createdAt: new Date("2026-01-01"),
    ...jobOverrides,
  },
  publishedAt: new Date("2026-01-02"),
});

describe("InMemoryPublishedJobRepository", () => {
  let repository: InMemoryPublishedJobRepository;

  beforeEach(() => {
    repository = new InMemoryPublishedJobRepository();
  });

  it("saves and returns published jobs", async () => {
    const job = createPublishedJob();

    await repository.save(job);

    const result = await repository.getAll();

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(job);
  });

  it("returns published job by id", async () => {
    await repository.save(createPublishedJob("1"));

    const result = await repository.getById("1");

    expect(result?.job.id).toBe("1");
  });

  it("returns null when published job does not exist", async () => {
    const result = await repository.getById("missing");

    expect(result).toBeNull();
  });

  it("finds published job by sourceName and sourceId", async () => {
    await repository.save(
      createPublishedJob("1", { sourceName: "feed-a", sourceId: "ext-1" }),
    );

    const result = await repository.findBySource("feed-a", "ext-1");

    expect(result?.job.id).toBe("1");
  });

  it("returns null when source identity does not match", async () => {
    await repository.save(
      createPublishedJob("1", { sourceName: "feed-a", sourceId: "ext-1" }),
    );

    expect(await repository.findBySource("feed-a", "other")).toBeNull();
    expect(await repository.findBySource("other", "ext-1")).toBeNull();
  });
});
