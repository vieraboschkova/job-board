import { beforeEach, describe, expect, it } from "vitest";

import { InMemoryPublishedJobRepository } from "../in-memory-published-job.repository";

import {
  CountryCode,
  EmploymentType,
  JobSort,
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

  it("searches jobs by title case-insensitively", async () => {
    await repository.save(
      createPublishedJob("1", {
        title: "Senior React Developer",
      }),
    );

    const result = await repository.search({
      search: "react",
    });

    expect(result).toHaveLength(1);
  });

  it("filters jobs by country", async () => {
    await repository.save(
      createPublishedJob("1", {
        location: {
          country: CountryCode.US,
          remote: true,
        },
      }),
    );

    await repository.save(
      createPublishedJob("2", {
        location: {
          country: CountryCode.CA,
          remote: true,
        },
      }),
    );

    const result = await repository.search({
      country: CountryCode.CA,
    });

    expect(result).toHaveLength(1);

    expect(result[0].job.id).toBe("2");
  });

  it("sorts jobs by salary descending", async () => {
    await repository.save(
      createPublishedJob("1", {
        salary: {
          min: 50000,
          currency: "USD",
          unit: SalaryUnit.Annual,
        },
      }),
    );

    await repository.save(
      createPublishedJob("2", {
        salary: {
          min: 100000,
          currency: "USD",
          unit: SalaryUnit.Annual,
        },
      }),
    );

    const result = await repository.search({
      sort: JobSort.SalaryDescending,
    });

    expect(result.map((job) => job.job.id)).toEqual(["2", "1"]);
  });

  it("sorts jobs by posted date ascending", async () => {
    await repository.save(
      createPublishedJob("1", {
        postedAt: new Date("2026-02-01"),
      }),
    );

    await repository.save(
      createPublishedJob("2", {
        postedAt: new Date("2026-01-01"),
      }),
    );

    const result = await repository.search({
      sort: JobSort.PostedAtAscending,
    });

    expect(result.map((job) => job.job.id)).toEqual(["2", "1"]);
  });
});
