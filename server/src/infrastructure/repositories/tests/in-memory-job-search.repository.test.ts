import { beforeEach, describe, expect, it } from "vitest";

import { InMemoryJobSearchRepository } from "../in-memory-job-search.repository";
import {
  CountryCode,
  EmploymentType,
  JobSort,
  SalaryUnit,
} from "../../../domain/job/job.enums";
import { JobSummary } from "../../../domain/job/job.types";

const createSummary = (
  id = "1",
  overrides?: Partial<JobSummary>,
): JobSummary => ({
  id,
  title: "Frontend Developer",
  company: "Acme",
  location: {
    country: CountryCode.US,
    city: "New York",
    remote: true,
  },
  employmentType: EmploymentType.FullTime,
  salary: {
    min: 80000,
    max: 100000,
    currency: "USD",
    unit: SalaryUnit.Annual,
  },
  postedAt: new Date("2026-01-01"),
  ...overrides,
});

describe("InMemoryJobSearchRepository", () => {
  let repository: InMemoryJobSearchRepository;

  beforeEach(() => {
    repository = new InMemoryJobSearchRepository();
  });

  it("upserts summaries by id", async () => {
    await repository.save(createSummary("1", { title: "Old title" }));
    await repository.save(createSummary("1", { title: "New title" }));

    const result = await repository.search({});

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("New title");
  });

  it("searches jobs by title case-insensitively", async () => {
    await repository.save(
      createSummary("1", {
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
      createSummary("1", {
        location: {
          country: CountryCode.US,
          remote: true,
        },
      }),
    );

    await repository.save(
      createSummary("2", {
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
    expect(result[0].id).toBe("2");
  });

  it("sorts jobs by salary descending", async () => {
    await repository.save(
      createSummary("1", {
        salary: {
          min: 50000,
          currency: "USD",
          unit: SalaryUnit.Annual,
        },
      }),
    );

    await repository.save(
      createSummary("2", {
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

    expect(result.map((summary) => summary.id)).toEqual(["2", "1"]);
  });

  it("sorts jobs by posted date ascending", async () => {
    await repository.save(
      createSummary("1", {
        postedAt: new Date("2026-02-01"),
      }),
    );

    await repository.save(
      createSummary("2", {
        postedAt: new Date("2026-01-01"),
      }),
    );

    const result = await repository.search({
      sort: JobSort.PostedAtAscending,
    });

    expect(result.map((summary) => summary.id)).toEqual(["2", "1"]);
  });
});
