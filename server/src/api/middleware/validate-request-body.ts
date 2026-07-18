import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "joi";

import { ApiErrorCode, HttpStatusCode } from "../constants";
import { sendApiError } from "../utils/send-api-error";

export function validateRequestBody<T>(schema: ObjectSchema<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      sendApiError(
        res,
        HttpStatusCode.BadRequest,
        ApiErrorCode.InvalidRequestBody,
        error.details.map((detail) => detail.message),
      );
      return;
    }

    req.body = value;
    next();
  };
}
