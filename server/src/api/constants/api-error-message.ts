import { ApiErrorCode } from "./api-error-code";

export const ApiErrorMessage: Record<ApiErrorCode, string> = {
  [ApiErrorCode.InvalidRequestBody]: "Invalid request body",
  [ApiErrorCode.NotFound]: "Resource not found",
  [ApiErrorCode.PayloadTooLarge]: "Request payload too large",
  [ApiErrorCode.InternalServerError]: "Internal server error",
};
