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

const HEALTH_PATH = `${ApiMountPath.Api}${ApiRoutePath.Health}`;
const INGEST_PATH = `${ApiMountPath.Api}${ApiRoutePath.Ingest}`;

export const openApiDocument = {
  openapi: "3.0.3",
  info: {
    title: "Job Board API",
    version: "0.1.0",
    description:
      "Job board API for the take-home. Ingestion is available now; search will be added next. OpenAPI is hand-maintained alongside Joi validation for the MVP.",
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
                    message:
                      ApiErrorMessage[ApiErrorCode.InternalServerError],
                    details: [],
                  },
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
          "errors",
        ],
        properties: {
          receivedCount: { type: "integer", minimum: 0 },
          normalizedCount: { type: "integer", minimum: 0 },
          approvedCount: { type: "integer", minimum: 0 },
          rejectedCount: { type: "integer", minimum: 0 },
          errors: {
            type: "array",
            items: {
              $ref: "#/components/schemas/IngestionError",
            },
          },
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
