import { NextFunction, Request, Response } from "express";

import { ApiErrorCode, HttpStatusCode } from "../constants";
import { sendApiError } from "../utils/send-api-error";

interface HttpErrorLike {
  expose?: boolean;
  status?: number;
  statusCode?: number;
  message?: string;
  type?: string;
}

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  console.error(error);

  if (res.headersSent) {
    return;
  }

  const clientError = toClientHttpError(error);
  if (clientError) {
    sendApiError(
      res,
      clientError.statusCode,
      clientError.code,
      clientError.details,
    );
    return;
  }

  // TODO: map domain errors to ApiErrorCode; send to Sentry or other error tracking
  sendApiError(
    res,
    HttpStatusCode.InternalServerError,
    ApiErrorCode.InternalServerError,
  );
}

function toClientHttpError(error: unknown): {
  statusCode: HttpStatusCode;
  code: ApiErrorCode;
  details: string[];
} | null {
  if (!isHttpErrorLike(error) || error.expose !== true) {
    return null;
  }

  const status = error.status ?? error.statusCode;
  if (typeof status !== "number" || status < 400 || status >= 500) {
    return null;
  }

  if (status === HttpStatusCode.PayloadTooLarge) {
    return {
      statusCode: HttpStatusCode.PayloadTooLarge,
      code: ApiErrorCode.PayloadTooLarge,
      details: error.message ? [error.message] : [],
    };
  }

  return {
    statusCode: HttpStatusCode.BadRequest,
    code: ApiErrorCode.InvalidRequestBody,
    details: error.message ? [error.message] : [],
  };
}

function isHttpErrorLike(error: unknown): error is HttpErrorLike {
  return typeof error === "object" && error !== null;
}
