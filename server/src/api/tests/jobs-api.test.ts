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
import { InMemoryPublishedJobRepository } from "../../infrastructure/repositories/in-memory-published-job.repository";
import { InMemoryRejectedJobRepository } from "../../infrastructure/repositories/in-memory-rejected-job.repository";
import { createApp } from "../../app";
import { AppDependencies } from "../../create-app-dependencies";
import { JobIngestionService } from "../../workflows/ingestion/job-ingestion-service";
import { DefaultJobNormalizer } from "../../workflows/normalization/default-job-normalizer";
import { JobPublishingService } from "../../workflows/publishing/job-publishing-service";
import { JobRejectionService } from "../../workflows/rejection/job-rejection-service";
import { createJob } from "../../workflows/review/tests/create-job";
import { DefaultReviewEngine } from "../../workflows/review/default-review-engine";
import { JobReaderService } from "../../workflows/job-reader/job-reader-service";

const JOBS_URL = `${ApiMountPath.Api}${ApiRoutePath.Jobs}`;
const JOBS_SEARCH_URL = `${ApiMountPath.Api}${ApiRoutePath.JobsSearch}`;
const DOCS_JSON_URL = `${ApiMountPath.Api}${ApiRoutePath.DocsJson}`;

function jobByIdUrl(id: string): string {
  return `${JOBS_URL}/${id}`;
}

describe("GET /api/jobs", () => {
  let publishedJobRepository: InMemoryPublishedJobRepository;
  let deps: AppDependencies;

  beforeEach(() => {
    publishedJobRepository = new InMemoryPublishedJobRepository();
    const rejectedJobRepository = new InMemoryRejectedJobRepository();
    deps = {
      publishedJobRepository,
      rejectedJobRepository,
      ingestionService: new JobIngestionService(
        new DefaultJobNormalizer(),
        new DefaultReviewEngine(),
        new JobPublishingService(publishedJobRepository),
        new JobRejectionService(rejectedJobRepository),
      ),
      jobReader: new JobReaderService(publishedJobRepository),
    };
  });

  async function seedPublishedJobs(): Promise<void> {
    const jobs = [
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

    for (const job of jobs) {
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

  it("lists approved jobs", async () => {
    await seedPublishedJobs();

    const response = await request(createApp(deps)).get(JOBS_URL);

    expect(response.status).toBe(HttpStatusCode.Ok);
    expect(response.body).toHaveLength(3);
    expect(response.body.map((job: { id: string }) => job.id)).toEqual([
      "low-salary",
      "high-salary",
      "canada-job",
    ]);
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
  let deps: AppDependencies;

  beforeEach(() => {
    publishedJobRepository = new InMemoryPublishedJobRepository();
    const rejectedJobRepository = new InMemoryRejectedJobRepository();
    deps = {
      publishedJobRepository,
      rejectedJobRepository,
      ingestionService: new JobIngestionService(
        new DefaultJobNormalizer(),
        new DefaultReviewEngine(),
        new JobPublishingService(publishedJobRepository),
        new JobRejectionService(rejectedJobRepository),
      ),
      jobReader: new JobReaderService(publishedJobRepository),
    };
  });

  async function seedPublishedJobs(): Promise<void> {
    const jobs = [
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

    for (const job of jobs) {
      await publishedJobRepository.save({
        job,
        publishedAt: new Date("2023-10-20"),
      });
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
});

describe("GET /api/jobs/:id", () => {
  let publishedJobRepository: InMemoryPublishedJobRepository;
  let deps: AppDependencies;

  beforeEach(() => {
    publishedJobRepository = new InMemoryPublishedJobRepository();
    const rejectedJobRepository = new InMemoryRejectedJobRepository();
    deps = {
      publishedJobRepository,
      rejectedJobRepository,
      ingestionService: new JobIngestionService(
        new DefaultJobNormalizer(),
        new DefaultReviewEngine(),
        new JobPublishingService(publishedJobRepository),
        new JobRejectionService(rejectedJobRepository),
      ),
      jobReader: new JobReaderService(publishedJobRepository),
    };
  });

  it("returns a published job by id", async () => {
    const job = createJob({ id: "job-42", title: "Staff Engineer" });
    await publishedJobRepository.save({
      job,
      publishedAt: new Date("2023-10-20"),
    });

    const response = await request(createApp(deps)).get(jobByIdUrl("job-42"));

    expect(response.status).toBe(HttpStatusCode.Ok);
    expect(response.body.id).toBe("job-42");
    expect(response.body.title).toBe("Staff Engineer");
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
