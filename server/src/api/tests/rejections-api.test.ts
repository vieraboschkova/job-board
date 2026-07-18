import { beforeEach, describe, expect, it } from "vitest";
import request from "supertest";

import { ApiMountPath, ApiRoutePath, HttpStatusCode } from "../constants";
import {
  CompanyType,
  CountryCode,
  EmploymentType,
  Language,
  SalaryUnit,
} from "../../domain/job/job.enums";
import { RejectionReason } from "../../domain/review/review.enums";
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

const REJECTIONS_URL = `${ApiMountPath.Api}${ApiRoutePath.Rejections}`;
const DOCS_JSON_URL = `${ApiMountPath.Api}${ApiRoutePath.DocsJson}`;

describe("GET /api/rejections", () => {
  let rejectedJobRepository: InMemoryRejectedJobRepository;
  let deps: AppDependencies;

  beforeEach(() => {
    const publishedJobRepository = new InMemoryPublishedJobRepository();
    rejectedJobRepository = new InMemoryRejectedJobRepository();
    deps = {
      publishedJobRepository,
      rejectedJobRepository,
      ingestionService: new JobIngestionService(
        new DefaultJobNormalizer(),
        new DefaultReviewEngine(),
        new JobPublishingService(publishedJobRepository),
        new JobRejectionService(rejectedJobRepository),
      ),
      publishedJobsReader: new PublishedJobsReaderService(
        publishedJobRepository,
      ),
      rejectedJobsReader: new RejectedJobsReaderService(rejectedJobRepository),
    };
  });

  it("returns an empty array when no jobs are rejected", async () => {
    const response = await request(createApp(deps)).get(REJECTIONS_URL);

    expect(response.status).toBe(HttpStatusCode.Ok);
    expect(response.body).toEqual([]);
  });

  it("lists rejection summaries with rule fields and reasons", async () => {
    const job = createJob({
      id: "rej-api-1",
      title: "Part-time Designer",
      company: "TempCo",
      companyType: CompanyType.StaffingFirm,
      language: Language.German,
      location: { country: CountryCode.UK, city: "London", remote: false },
      employmentType: EmploymentType.PartTime,
      salary: {
        min: 50000,
        currency: "USD",
        unit: SalaryUnit.Annual,
      },
      sourceName: "review-feed",
    });
    const rejectedAt = new Date("2023-12-01T08:30:00.000Z");
    const rejectionReasons = [
      { reason: RejectionReason.InvalidEmploymentType },
      { reason: RejectionReason.InvalidCompanyType, details: "staffing firm" },
    ];

    await rejectedJobRepository.save({
      job,
      rejectedAt,
      rejectionReasons,
    });

    const response = await request(createApp(deps)).get(REJECTIONS_URL);

    expect(response.status).toBe(HttpStatusCode.Ok);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toEqual({
      id: "rej-api-1",
      sourceName: "review-feed",
      rejectedAt: rejectedAt.toISOString(),
      rejectionReasons,
      job: {
        title: "Part-time Designer",
        language: Language.German,
        location: { country: CountryCode.UK, city: "London", remote: false },
        employmentType: EmploymentType.PartTime,
        salary: {
          min: 50000,
          currency: "USD",
          unit: SalaryUnit.Annual,
        },
        companyType: CompanyType.StaffingFirm,
        company: "TempCo",
      },
    });
    expect(response.body[0].job).not.toHaveProperty("rawData");
    expect(response.body[0].job).not.toHaveProperty("description");
  });

  it("documents GET /api/rejections in OpenAPI", async () => {
    const response = await request(createApp(deps)).get(DOCS_JSON_URL);

    expect(response.status).toBe(HttpStatusCode.Ok);
    expect(response.body.paths[REJECTIONS_URL]).toBeDefined();
    expect(response.body.paths[REJECTIONS_URL].get).toBeDefined();
    expect(response.body.components.schemas.RejectionSummary).toBeDefined();
  });
});
