import { beforeEach, describe, expect, it } from "vitest";
import request from "supertest";

import {
  ApiErrorCode,
  ApiErrorMessage,
  ApiMountPath,
  ApiRoutePath,
  HttpStatusCode,
  IngestRequestField,
} from "../constants";
import { RawJobPosting } from "../../domain/ingestion/ingestion.types";
import { InMemoryPublishedJobRepository } from "../../infrastructure/repositories/in-memory-published-job.repository";
import { InMemoryRejectedJobRepository } from "../../infrastructure/repositories/in-memory-rejected-job.repository";
import exampleJobs from "../../tests/mock/exampleJobs.json";
import { createApp } from "../../app";
import { AppDependencies } from "../../create-app-dependencies";
import { JobIngestionService } from "../../workflows/ingestion/job-ingestion-service";
import { DefaultJobNormalizer } from "../../workflows/normalization/default-job-normalizer";
import { JobPublishingService } from "../../workflows/publishing/job-publishing-service";
import { JobRejectionService } from "../../workflows/rejection/job-rejection-service";
import { RejectedJobsReaderService } from "../../workflows/rejection/rejected-jobs-reader-service";
import { DefaultReviewEngine } from "../../workflows/review/default-review-engine";
import { PublishedJobsReaderService } from "../../workflows/published-jobs-reader/published-jobs-reader-service";
import { MAX_JOBS_PER_INGEST_BATCH } from "../schemas/ingest-request.schema";

const INGEST_URL = `${ApiMountPath.Api}${ApiRoutePath.Ingest}`;
const DOCS_URL = `${ApiMountPath.Api}${ApiRoutePath.Docs}`;
const DOCS_JSON_URL = `${ApiMountPath.Api}${ApiRoutePath.DocsJson}`;

describe("POST /api/ingest", () => {
  let publishedJobRepository: InMemoryPublishedJobRepository;
  let rejectedJobRepository: InMemoryRejectedJobRepository;
  let deps: AppDependencies;

  beforeEach(() => {
    publishedJobRepository = new InMemoryPublishedJobRepository();
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

  it("returns 400 when sourceName is missing", async () => {
    const response = await request(createApp(deps))
      .post(INGEST_URL)
      .send({ [IngestRequestField.Jobs]: [] });

    expect(response.status).toBe(HttpStatusCode.BadRequest);
    expect(response.body.error.code).toBe(ApiErrorCode.InvalidRequestBody);
    expect(response.body.error.message).toBe(
      ApiErrorMessage[ApiErrorCode.InvalidRequestBody],
    );
    expect(response.body.error.details.length).toBeGreaterThan(0);
  });

  it("returns 400 when sourceName is whitespace", async () => {
    const response = await request(createApp(deps))
      .post(INGEST_URL)
      .send({
        [IngestRequestField.SourceName]: "   ",
        [IngestRequestField.Jobs]: [],
      });

    expect(response.status).toBe(HttpStatusCode.BadRequest);
    expect(response.body.error.code).toBe(ApiErrorCode.InvalidRequestBody);
  });

  it("returns 400 when jobs is not an array", async () => {
    const response = await request(createApp(deps))
      .post(INGEST_URL)
      .send({
        [IngestRequestField.SourceName]: "sample",
        [IngestRequestField.Jobs]: "not-an-array",
      });

    expect(response.status).toBe(HttpStatusCode.BadRequest);
    expect(response.body.error.code).toBe(ApiErrorCode.InvalidRequestBody);
  });

  it("returns 400 when jobs items are not objects", async () => {
    const response = await request(createApp(deps))
      .post(INGEST_URL)
      .send({
        [IngestRequestField.SourceName]: "sample",
        [IngestRequestField.Jobs]: ["string-job", null, 42],
      });

    expect(response.status).toBe(HttpStatusCode.BadRequest);
    expect(response.body.error.code).toBe(ApiErrorCode.InvalidRequestBody);
  });

  it("returns 400 when the jobs array exceeds the batch limit", async () => {
    const response = await request(createApp(deps))
      .post(INGEST_URL)
      .send({
        [IngestRequestField.SourceName]: "sample",
        [IngestRequestField.Jobs]: Array.from(
          { length: MAX_JOBS_PER_INGEST_BATCH + 1 },
          () => ({}),
        ),
      });

    expect(response.status).toBe(HttpStatusCode.BadRequest);
    expect(response.body.error.code).toBe(ApiErrorCode.InvalidRequestBody);
  });

  it("returns 400 for malformed JSON", async () => {
    const response = await request(createApp(deps))
      .post(INGEST_URL)
      .set("Content-Type", "application/json")
      .send("{not-json");

    expect(response.status).toBe(HttpStatusCode.BadRequest);
    expect(response.body.error.code).toBe(ApiErrorCode.InvalidRequestBody);
    expect(response.body.error.details.length).toBeGreaterThan(0);
  });

  it("returns 400 for a non-object JSON body", async () => {
    const response = await request(createApp(deps))
      .post(INGEST_URL)
      .set("Content-Type", "application/json")
      .send("[1,2,3]");

    expect(response.status).toBe(HttpStatusCode.BadRequest);
    expect(response.body.error.code).toBe(ApiErrorCode.InvalidRequestBody);
  });

  it("returns 413 when the JSON body exceeds the size limit", async () => {
    const oversizedField = "x".repeat(150_000);
    const response = await request(createApp(deps))
      .post(INGEST_URL)
      .set("Content-Type", "application/json")
      .send(
        JSON.stringify({
          [IngestRequestField.SourceName]: "sample",
          [IngestRequestField.Jobs]: [{ oversizedField }],
        }),
      );

    expect(response.status).toBe(HttpStatusCode.PayloadTooLarge);
    expect(response.body.error.code).toBe(ApiErrorCode.PayloadTooLarge);
    expect(response.body.error.message).toBe(
      ApiErrorMessage[ApiErrorCode.PayloadTooLarge],
    );
  });

  it("returns zero counts for an empty batch", async () => {
    const response = await request(createApp(deps))
      .post(INGEST_URL)
      .send({
        [IngestRequestField.SourceName]: "sample",
        [IngestRequestField.Jobs]: [],
      });

    expect(response.status).toBe(HttpStatusCode.Ok);
    expect(response.body).toEqual({
      receivedCount: 0,
      normalizedCount: 0,
      approvedCount: 0,
      rejectedCount: 0,
      errors: [],
    });
  });

  it("ingests a mixed batch and persists approved and rejected jobs", async () => {
    const jobs = [
      exampleJobs[0] as RawJobPosting,
      exampleJobs[1] as RawJobPosting,
    ];

    const response = await request(createApp(deps))
      .post(INGEST_URL)
      .send({
        [IngestRequestField.SourceName]: "mixed-feed",
        [IngestRequestField.Jobs]: jobs,
      });

    expect(response.status).toBe(HttpStatusCode.Ok);
    expect(response.body).toEqual({
      receivedCount: 2,
      normalizedCount: 2,
      approvedCount: 1,
      rejectedCount: 1,
      errors: [],
    });

    expect(await publishedJobRepository.getAll()).toHaveLength(1);
    expect(await rejectedJobRepository.getAll()).toHaveLength(1);
  });

  it("returns 500 when the ingestion service throws", async () => {
    deps = {
      publishedJobRepository,
      rejectedJobRepository,
      ingestionService: {
        ingest: async () => {
          throw new Error("unexpected failure");
        },
      },
    };

    const response = await request(createApp(deps))
      .post(INGEST_URL)
      .send({
        [IngestRequestField.SourceName]: "sample",
        [IngestRequestField.Jobs]: [],
      });

    expect(response.status).toBe(HttpStatusCode.InternalServerError);
    expect(response.body.error.code).toBe(ApiErrorCode.InternalServerError);
    expect(response.body.error.message).toBe(
      ApiErrorMessage[ApiErrorCode.InternalServerError],
    );
  });
});

describe("API not found", () => {
  it("returns 404 for unknown API routes", async () => {
    const response = await request(createApp()).get(
      `${ApiMountPath.Api}/unknown-route`,
    );

    expect(response.status).toBe(HttpStatusCode.NotFound);
    expect(response.body.error.code).toBe(ApiErrorCode.NotFound);
    expect(response.body.error.message).toBe(
      ApiErrorMessage[ApiErrorCode.NotFound],
    );
  });
});

describe("API docs", () => {
  it("serves OpenAPI JSON", async () => {
    const response = await request(createApp()).get(DOCS_JSON_URL);

    expect(response.status).toBe(HttpStatusCode.Ok);
    expect(response.body.openapi).toBe("3.0.3");
    expect(response.body.paths[INGEST_URL]).toBeDefined();
  });

  it("serves Swagger UI", async () => {
    const response = await request(createApp()).get(`${DOCS_URL}/`);

    expect(response.status).toBe(HttpStatusCode.Ok);
    expect(response.text.toLowerCase()).toContain("swagger");
  });
});
