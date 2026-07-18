import { Request, Response } from "express";

import { ApiErrorCode, HttpStatusCode } from "../constants";
import { sendApiError } from "../utils/send-api-error";

export function apiNotFound(_req: Request, res: Response): void {
  sendApiError(res, HttpStatusCode.NotFound, ApiErrorCode.NotFound);
}
