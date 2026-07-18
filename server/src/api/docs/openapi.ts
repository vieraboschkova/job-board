import {
  ApiErrorCode,
  ApiErrorMessage,
  ApiMountPath,
  ApiRoutePath,
  HealthStatus,
  HttpStatusCode,
  IngestRequestField,
} from "../constants";
import { MAX_JOBS_PER_INGEST_BATCH } from "../schemas/ingest-request.schema";
import {
  CompanyType,
  CountryCode,
  EmploymentType,
  JobSort,
  Language,
  SalaryUnit,
} from "../../domain/job/job.enums";
import { RejectionReason } from "../../domain/review/review.enums";

const HEALTH_PATH = `${ApiMountPath.Api}${ApiRoutePath.Health}`;
const INGEST_PATH = `${ApiMountPath.Api}${ApiRoutePath.Ingest}`;
const JOBS_PATH = `${ApiMountPath.Api}${ApiRoutePath.Jobs}`;
const JOBS_SEARCH_PATH = `${ApiMountPath.Api}${ApiRoutePath.JobsSearch}`;
const REJECTIONS_PATH = `${ApiMountPath.Api}${ApiRoutePath.Rejections}`;

export const openApiDocument = {
  openapi: "3.0.3",
  info: {
    title: "Job Board API",
    version: "0.1.0",
    description:
      "Job board API for the take-home. Supports ingestion, approved-job search, and rejection log listing. OpenAPI is hand-maintained alongside Joi validation for the MVP.",
  },
  servers: [{ url: "/" }],
  paths: {
    [HEALTH_PATH]: {
      get: {
        tags: ["Health"],
        summary: "Health check",
        description:
          "Liveness check driven by a HealthChecker. Default checker returns ok. Inject a different checker to report degraded or unhealthy.",
        operationId: "getHealth",
        responses: {
          [String(HttpStatusCode.Ok)]: {
            description: "Service is ok or degraded",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["status"],
                  properties: {
                    status: {
                      type: "string",
                      enum: [HealthStatus.Ok, HealthStatus.Degraded],
                    },
                  },
                },
              },
            },
          },
          [String(HttpStatusCode.ServiceUnavailable)]: {
            description: "Service is unhealthy",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["status"],
                  properties: {
                    status: {
                      type: "string",
                      enum: [HealthStatus.Unhealthy],
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    [INGEST_PATH]: {
      post: {
        tags: ["Ingestion"],
        summary: "Ingest a batch of raw job postings",
        operationId: "ingestJobs",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/IngestRequest",
              },
              example: {
                [IngestRequestField.SourceName]: "sample",
                [IngestRequestField.Jobs]: [],
              },
            },
          },
        },
        responses: {
          [String(HttpStatusCode.Ok)]: {
            description: "Ingestion summary",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/IngestionResult",
                },
              },
            },
          },
          [String(HttpStatusCode.BadRequest)]: {
            description: "Invalid request body",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ApiErrorResponse",
                },
                example: {
                  error: {
                    code: ApiErrorCode.InvalidRequestBody,
                    message: ApiErrorMessage[ApiErrorCode.InvalidRequestBody],
                    details: ['"sourceName" is required'],
                  },
                },
              },
            },
          },
          [String(HttpStatusCode.PayloadTooLarge)]: {
            description: "Request body exceeds the JSON size limit",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ApiErrorResponse",
                },
                example: {
                  error: {
                    code: ApiErrorCode.PayloadTooLarge,
                    message: ApiErrorMessage[ApiErrorCode.PayloadTooLarge],
                    details: ["request entity too large"],
                  },
                },
              },
            },
          },
          [String(HttpStatusCode.InternalServerError)]: {
            description: "Unexpected server error while ingesting",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ApiErrorResponse",
                },
                example: {
                  error: {
                    code: ApiErrorCode.InternalServerError,
                    message: ApiErrorMessage[ApiErrorCode.InternalServerError],
                    details: [],
                  },
                },
              },
            },
          },
        },
      },
    },
    [JOBS_PATH]: {
      get: {
        tags: ["Jobs"],
        summary: "List all approved jobs",
        description:
          "Returns all approved (published) jobs with no filters. Omits raw ingestion payload; use fields on this resource for display.",
        operationId: "getAllJobs",
        responses: {
          [String(HttpStatusCode.Ok)]: {
            description: "All approved jobs",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Job",
                  },
                },
              },
            },
          },
          [String(HttpStatusCode.InternalServerError)]: {
            description: "Unexpected server error while listing jobs",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ApiErrorResponse",
                },
              },
            },
          },
        },
      },
    },
    [JOBS_SEARCH_PATH]: {
      get: {
        tags: ["Jobs"],
        summary: "Search approved jobs",
        description:
          "Returns approved job summaries for list cards (id, title, company, location, employment type, salary, posted date). Fetch GET /api/jobs/{id} for full details. Optional search filters by title/company substring. Invalid country or sort values are ignored safely.",
        operationId: "searchJobs",
        parameters: [
          {
            name: "search",
            in: "query",
            required: false,
            schema: { type: "string" },
            description: "Case-insensitive substring match on title or company",
          },
          {
            name: "country",
            in: "query",
            required: false,
            schema: {
              type: "string",
              enum: Object.values(CountryCode),
            },
            description: "Filter by normalized country code",
          },
          {
            name: "sort",
            in: "query",
            required: false,
            schema: {
              type: "string",
              enum: Object.values(JobSort),
            },
            description:
              "Sort order. Unsupported values are ignored (no default sort).",
          },
        ],
        responses: {
          [String(HttpStatusCode.Ok)]: {
            description: "Approved job summaries matching the query",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/JobSummary",
                  },
                },
              },
            },
          },
          [String(HttpStatusCode.InternalServerError)]: {
            description: "Unexpected server error while searching",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ApiErrorResponse",
                },
              },
            },
          },
        },
      },
    },
    [`${JOBS_PATH}/{id}`]: {
      get: {
        tags: ["Jobs"],
        summary: "Get an approved job by id",
        description:
          "Returns an approved job for the detail view. Omits the raw ingestion payload.",
        operationId: "getJobById",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Published job id",
          },
        ],
        responses: {
          [String(HttpStatusCode.Ok)]: {
            description: "Approved job",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Job",
                },
              },
            },
          },
          [String(HttpStatusCode.NotFound)]: {
            description: "Job not found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ApiErrorResponse",
                },
                example: {
                  error: {
                    code: ApiErrorCode.NotFound,
                    message: ApiErrorMessage[ApiErrorCode.NotFound],
                    details: [],
                  },
                },
              },
            },
          },
          [String(HttpStatusCode.InternalServerError)]: {
            description: "Unexpected server error while fetching the job",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ApiErrorResponse",
                },
              },
            },
          },
        },
      },
    },
    [REJECTIONS_PATH]: {
      get: {
        tags: ["Rejections"],
        summary: "List rejected jobs",
        description:
          "Returns rejected job summaries for debugging and reviewer visibility. Top-level id, sourceName, rejectedAt, and rejectionReasons; rule-relevant job fields nested under job. Omits raw ingestion payload and description.",
        operationId: "listRejections",
        responses: {
          [String(HttpStatusCode.Ok)]: {
            description: "Rejected job summaries",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/RejectionSummary",
                  },
                },
              },
            },
          },
          [String(HttpStatusCode.InternalServerError)]: {
            description: "Unexpected server error while listing rejections",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ApiErrorResponse",
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      IngestRequest: {
        type: "object",
        required: [IngestRequestField.SourceName, IngestRequestField.Jobs],
        properties: {
          [IngestRequestField.SourceName]: {
            type: "string",
            minLength: 1,
            description: "Name of the feed or source providing the jobs",
          },
          [IngestRequestField.Jobs]: {
            type: "array",
            maxItems: MAX_JOBS_PER_INGEST_BATCH,
            description:
              "Raw job postings. Shape is intentionally permissive; normalization handles field variance.",
            items: {
              type: "object",
              additionalProperties: true,
            },
          },
        },
      },
      IngestionResult: {
        type: "object",
        required: [
          "receivedCount",
          "normalizedCount",
          "approvedCount",
          "rejectedCount",
          "duplicatesCount",
          "duplicates",
          "errors",
        ],
        properties: {
          receivedCount: { type: "integer", minimum: 0 },
          normalizedCount: { type: "integer", minimum: 0 },
          approvedCount: { type: "integer", minimum: 0 },
          rejectedCount: { type: "integer", minimum: 0 },
          duplicatesCount: { type: "integer", minimum: 0 },
          duplicates: {
            type: "array",
            items: {
              $ref: "#/components/schemas/IngestionDuplicate",
            },
          },
          errors: {
            type: "array",
            items: {
              $ref: "#/components/schemas/IngestionError",
            },
          },
        },
      },
      IngestionDuplicate: {
        type: "object",
        required: ["sourceName", "id"],
        properties: {
          sourceName: { type: "string" },
          id: {
            type: "string",
            description: "Our id of the already-published job",
          },
          sourceId: { type: "string" },
        },
      },
      IngestionError: {
        type: "object",
        required: ["index", "message"],
        properties: {
          index: { type: "integer", minimum: 0 },
          message: { type: "string" },
        },
      },
      Job: {
        type: "object",
        required: [
          "id",
          "title",
          "company",
          "description",
          "language",
          "location",
          "employmentType",
          "companyType",
          "sourceName",
          "createdAt",
        ],
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          company: { type: "string" },
          description: { type: "string" },
          language: {
            type: "string",
            enum: Object.values(Language),
          },
          location: {
            $ref: "#/components/schemas/Location",
          },
          salary: {
            $ref: "#/components/schemas/Salary",
          },
          employmentType: {
            type: "string",
            enum: Object.values(EmploymentType),
          },
          companyType: {
            type: "string",
            enum: Object.values(CompanyType),
          },
          sourceName: { type: "string" },
          sourceId: { type: "string" },
          postedAt: {
            type: "string",
            format: "date-time",
          },
          createdAt: {
            type: "string",
            format: "date-time",
          },
        },
      },
      JobSummary: {
        type: "object",
        required: ["id", "title", "company", "location", "employmentType"],
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          company: { type: "string" },
          location: {
            $ref: "#/components/schemas/Location",
          },
          employmentType: {
            type: "string",
            enum: Object.values(EmploymentType),
          },
          salary: {
            $ref: "#/components/schemas/Salary",
          },
          postedAt: {
            type: "string",
            format: "date-time",
          },
        },
      },
      RejectionSummary: {
        type: "object",
        required: ["id", "sourceName", "rejectedAt", "rejectionReasons", "job"],
        properties: {
          id: { type: "string" },
          sourceName: { type: "string" },
          rejectedAt: {
            type: "string",
            format: "date-time",
          },
          rejectionReasons: {
            type: "array",
            items: {
              $ref: "#/components/schemas/RejectionDetail",
            },
          },
          job: {
            $ref: "#/components/schemas/RejectionJobSummary",
          },
        },
      },
      RejectionJobSummary: {
        type: "object",
        required: [
          "title",
          "language",
          "location",
          "employmentType",
          "companyType",
          "company",
        ],
        properties: {
          title: { type: "string" },
          language: {
            type: "string",
            enum: Object.values(Language),
          },
          location: {
            $ref: "#/components/schemas/Location",
          },
          employmentType: {
            type: "string",
            enum: Object.values(EmploymentType),
          },
          salary: {
            $ref: "#/components/schemas/Salary",
          },
          companyType: {
            type: "string",
            enum: Object.values(CompanyType),
          },
          company: { type: "string" },
        },
      },
      RejectionDetail: {
        type: "object",
        required: ["reason"],
        properties: {
          reason: {
            type: "string",
            enum: Object.values(RejectionReason),
          },
          details: { type: "string" },
        },
      },
      Location: {
        type: "object",
        required: ["country", "remote"],
        properties: {
          country: {
            type: "string",
            enum: Object.values(CountryCode),
          },
          city: { type: "string" },
          remote: { type: "boolean" },
        },
      },
      Salary: {
        type: "object",
        required: ["currency", "unit"],
        properties: {
          min: { type: "number" },
          max: { type: "number" },
          currency: { type: "string" },
          unit: {
            type: "string",
            enum: Object.values(SalaryUnit),
          },
        },
      },
      ApiErrorResponse: {
        type: "object",
        required: ["error"],
        properties: {
          error: {
            type: "object",
            required: ["code", "message", "details"],
            properties: {
              code: {
                type: "string",
                enum: Object.values(ApiErrorCode),
              },
              message: {
                type: "string",
                example: ApiErrorMessage[ApiErrorCode.InvalidRequestBody],
              },
              details: {
                type: "array",
                items: { type: "string" },
              },
            },
          },
        },
      },
    },
  },
};
