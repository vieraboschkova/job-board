import { Response } from "express";

import { ApiErrorCode, ApiErrorMessage, HttpStatusCode } from "../constants";

export function sendApiError(
  res: Response,
  statusCode: HttpStatusCode,
  code: ApiErrorCode,
  details: string[] = [],
): void {
  res.status(statusCode).json({
    error: {
      code,
      message: ApiErrorMessage[code],
      details,
    },
  });
}
