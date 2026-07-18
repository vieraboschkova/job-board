import { beforeEach, describe, expect, it } from "vitest";
import request from "supertest";

import {
  ApiErrorCode,
  ApiErrorMessage,
  ApiMountPath,
  ApiRoutePath,
  HttpStatusCode,
} from "../constants";
import { CountryCode, JobSort, SalaryUnit } from "../../domain/job/job.enums";
import { Job } from "../../domain/job/job.types";
import { InMemoryJobSearchRepository } from "../../infrastructure/repositories/in-memory-job-search.repository";
import { InMemoryPublishedJobRepository } from "../../infrastructure/repositories/in-memory-published-job.repository";
import { InMemoryRejectedJobRepository } from "../../infrastructure/repositories/in-memory-rejected-job.repository";
import { createApp } from "../../app";
import { AppDependencies } from "../../create-app-dependencies";
import { JobIngestionService } from "../../workflows/ingestion/job-ingestion-service";
import { DefaultJobNormalizer } from "../../workflows/normalization/default-job-normalizer";
import { JobPublishingService } from "../../workflows/publishing/job-publishing-service";
import { JobRejectionService } from "../../workflows/rejection/job-rejection-service";
import { RejectedJobsReaderService } from "../../workflows/rejection/rejected-jobs-reader-service";
import { createJob } from "../../workflows/review/tests/create-job";
import { DefaultReviewEngine } from "../../workflows/review/default-review-engine";
import { PublishedJobsReaderService } from "../../workflows/published-jobs-reader/published-jobs-reader-service";
import { toJobSummary } from "../../workflows/published-jobs-reader/to-job-summary";

const JOBS_URL = `${ApiMountPath.Api}${ApiRoutePath.Jobs}`;
const JOBS_SEARCH_URL = `${ApiMountPath.Api}${ApiRoutePath.JobsSearch}`;
const DOCS_JSON_URL = `${ApiMountPath.Api}${ApiRoutePath.DocsJson}`;

function jobByIdUrl(id: string): string {
  return `${JOBS_URL}/${id}`;
}

function createJobsTestDeps(): {
  publishedJobRepository: InMemoryPublishedJobRepository;
  jobSearchRepository: InMemoryJobSearchRepository;
  deps: AppDependencies;
} {
  const publishedJobRepository = new InMemoryPublishedJobRepository();
  const jobSearchRepository = new InMemoryJobSearchRepository();
  const rejectedJobRepository = new InMemoryRejectedJobRepository();
  return {
    publishedJobRepository,
    jobSearchRepository,
    deps: {
      publishedJobRepository,
      jobSearchRepository,
      rejectedJobRepository,
      ingestionService: new JobIngestionService(
        new DefaultJobNormalizer(),
        new DefaultReviewEngine(),
        new JobPublishingService(publishedJobRepository, jobSearchRepository),
        new JobRejectionService(rejectedJobRepository),
      ),
      publishedJobsReader: new PublishedJobsReaderService(
        publishedJobRepository,
        jobSearchRepository,
      ),
      rejectedJobsReader: new RejectedJobsReaderService(rejectedJobRepository),
    },
  };
}

const sampleJobs = (): Job[] => [
  createJob({
    id: "low-salary",
    title: "Junior Engineer",
    company: "Acme",
    location: { country: CountryCode.US, remote: false },
    salary: {
      min: 110000,
      max: 120000,
      currency: "USD",
      unit: SalaryUnit.Annual,
    },
    postedAt: new Date("2023-10-01"),
  }),
  createJob({
    id: "high-salary",
    title: "Senior Engineer",
    company: "Globex",
    location: { country: CountryCode.US, remote: true },
    salary: {
      min: 160000,
      max: 180000,
      currency: "USD",
      unit: SalaryUnit.Annual,
    },
    postedAt: new Date("2023-10-15"),
  }),
  createJob({
    id: "canada-job",
    title: "Product Manager",
    company: "Maple Soft",
    location: { country: CountryCode.CA, city: "Toronto", remote: false },
    salary: {
      min: 130000,
      max: 140000,
      currency: "USD",
      unit: SalaryUnit.Annual,
    },
    postedAt: new Date("2023-10-10"),
  }),
];

describe("GET /api/jobs", () => {
  let publishedJobRepository: InMemoryPublishedJobRepository;
  let deps: AppDependencies;

  beforeEach(() => {
    ({ publishedJobRepository, deps } = createJobsTestDeps());
  });

  async function seedPublishedJobs(): Promise<void> {
    for (const job of sampleJobs()) {
      await publishedJobRepository.save({
        job,
        publishedAt: new Date("2023-10-20"),
      });
    }
  }

  it("returns an empty array when no jobs are published", async () => {
    const response = await request(createApp(deps)).get(JOBS_URL);

    expect(response.status).toBe(HttpStatusCode.Ok);
    expect(response.body).toEqual([]);
  });

  it("lists approved jobs without rawData", async () => {
    await seedPublishedJobs();

    const response = await request(createApp(deps)).get(JOBS_URL);

    expect(response.status).toBe(HttpStatusCode.Ok);
    expect(response.body).toHaveLength(3);
    expect(response.body.map((job: { id: string }) => job.id)).toEqual([
      "low-salary",
      "high-salary",
      "canada-job",
    ]);
    for (const job of response.body) {
      expect(job).not.toHaveProperty("rawData");
    }
  });

  it("documents GET /api/jobs in OpenAPI", async () => {
    const response = await request(createApp(deps)).get(DOCS_JSON_URL);

    expect(response.status).toBe(HttpStatusCode.Ok);
    expect(response.body.paths[JOBS_URL]).toBeDefined();
    expect(response.body.paths[JOBS_URL].get).toBeDefined();
    expect(response.body.paths[JOBS_SEARCH_URL]).toBeDefined();
    expect(response.body.paths[JOBS_SEARCH_URL].get).toBeDefined();
    expect(response.body.paths[`${JOBS_URL}/{id}`]).toBeDefined();
    expect(response.body.paths[`${JOBS_URL}/{id}`].get).toBeDefined();
  });
});

describe("GET /api/jobs/search", () => {
  let publishedJobRepository: InMemoryPublishedJobRepository;
  let jobSearchRepository: InMemoryJobSearchRepository;
  let deps: AppDependencies;

  beforeEach(() => {
    ({ publishedJobRepository, jobSearchRepository, deps } =
      createJobsTestDeps());
  });

  async function seedPublishedJobs(): Promise<void> {
    for (const job of sampleJobs()) {
      await publishedJobRepository.save({
        job,
        publishedAt: new Date("2023-10-20"),
      });
      await jobSearchRepository.save(toJobSummary(job));
    }
  }

  it("searches jobs by title", async () => {
    await seedPublishedJobs();

    const response = await request(createApp(deps)).get(
      `${JOBS_SEARCH_URL}?search=engineer`,
    );

    expect(response.status).toBe(HttpStatusCode.Ok);
    expect(response.body.map((job: { id: string }) => job.id)).toEqual([
      "low-salary",
      "high-salary",
    ]);
  });

  it("filters jobs by country", async () => {
    await seedPublishedJobs();

    const response = await request(createApp(deps)).get(
      `${JOBS_SEARCH_URL}?country=${CountryCode.CA}`,
    );

    expect(response.status).toBe(HttpStatusCode.Ok);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].id).toBe("canada-job");
  });

  it("sorts jobs by salary descending", async () => {
    await seedPublishedJobs();

    const response = await request(createApp(deps)).get(
      `${JOBS_SEARCH_URL}?sort=${JobSort.SalaryDescending}`,
    );

    expect(response.status).toBe(HttpStatusCode.Ok);
    expect(response.body.map((job: { id: string }) => job.id)).toEqual([
      "high-salary",
      "canada-job",
      "low-salary",
    ]);
  });

  it("sorts jobs by salary ascending", async () => {
    await seedPublishedJobs();

    const response = await request(createApp(deps)).get(
      `${JOBS_SEARCH_URL}?sort=${JobSort.SalaryAscending}`,
    );

    expect(response.status).toBe(HttpStatusCode.Ok);
    expect(response.body.map((job: { id: string }) => job.id)).toEqual([
      "low-salary",
      "canada-job",
      "high-salary",
    ]);
  });

  it("sorts jobs by postedAt ascending", async () => {
    await seedPublishedJobs();

    const response = await request(createApp(deps)).get(
      `${JOBS_SEARCH_URL}?sort=${JobSort.PostedAtAscending}`,
    );

    expect(response.status).toBe(HttpStatusCode.Ok);
    expect(response.body.map((job: { id: string }) => job.id)).toEqual([
      "low-salary",
      "canada-job",
      "high-salary",
    ]);
  });

  it("sorts jobs by postedAt descending", async () => {
    await seedPublishedJobs();

    const response = await request(createApp(deps)).get(
      `${JOBS_SEARCH_URL}?sort=${JobSort.PostedAtDescending}`,
    );

    expect(response.status).toBe(HttpStatusCode.Ok);
    expect(response.body.map((job: { id: string }) => job.id)).toEqual([
      "high-salary",
      "canada-job",
      "low-salary",
    ]);
  });

  it("ignores invalid sort values and still returns 200", async () => {
    await seedPublishedJobs();

    const response = await request(createApp(deps)).get(
      `${JOBS_SEARCH_URL}?sort=not_a_real_sort`,
    );

    expect(response.status).toBe(HttpStatusCode.Ok);
    expect(response.body).toHaveLength(3);
    expect(response.body.map((job: { id: string }) => job.id)).toEqual([
      "low-salary",
      "high-salary",
      "canada-job",
    ]);
  });

  it("combines search, country, and sort query params", async () => {
    await seedPublishedJobs();

    const response = await request(createApp(deps)).get(
      `${JOBS_SEARCH_URL}?search=engineer&country=${CountryCode.US}&sort=${JobSort.SalaryDescending}`,
    );

    expect(response.status).toBe(HttpStatusCode.Ok);
    expect(response.body.map((job: { id: string }) => job.id)).toEqual([
      "high-salary",
      "low-salary",
    ]);
  });

  it("returns only card summary fields", async () => {
    await seedPublishedJobs();

    const response = await request(createApp(deps)).get(JOBS_SEARCH_URL);

    expect(response.status).toBe(HttpStatusCode.Ok);
    expect(response.body).toHaveLength(3);
    for (const job of response.body) {
      expect(Object.keys(job).sort()).toEqual(
        [
          "company",
          "employmentType",
          "id",
          "location",
          "postedAt",
          "salary",
          "title",
        ].sort(),
      );
      expect(job).not.toHaveProperty("description");
      expect(job).not.toHaveProperty("rawData");
      expect(job).not.toHaveProperty("sourceName");
    }
  });
});

describe("GET /api/jobs/:id", () => {
  let publishedJobRepository: InMemoryPublishedJobRepository;
  let deps: AppDependencies;

  beforeEach(() => {
    ({ publishedJobRepository, deps } = createJobsTestDeps());
  });

  it("returns a published job by id without rawData", async () => {
    const job = createJob({ id: "job-42", title: "Staff Engineer" });
    await publishedJobRepository.save({
      job,
      publishedAt: new Date("2023-10-20"),
    });

    const response = await request(createApp(deps)).get(jobByIdUrl("job-42"));

    expect(response.status).toBe(HttpStatusCode.Ok);
    expect(response.body.id).toBe("job-42");
    expect(response.body.title).toBe("Staff Engineer");
    expect(response.body).not.toHaveProperty("rawData");
    expect(response.body.description).toBeDefined();
  });

  it("returns 404 when the job does not exist", async () => {
    const response = await request(createApp(deps)).get(
      jobByIdUrl("missing-id"),
    );

    expect(response.status).toBe(HttpStatusCode.NotFound);
    expect(response.body.error.code).toBe(ApiErrorCode.NotFound);
    expect(response.body.error.message).toBe(
      ApiErrorMessage[ApiErrorCode.NotFound],
    );
  });
});
