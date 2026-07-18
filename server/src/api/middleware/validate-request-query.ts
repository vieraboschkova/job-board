import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "joi";

import { ApiErrorCode, HttpStatusCode } from "../constants";
import { sendApiError } from "../utils/send-api-error";

export function validateRequestQuery<T>(schema: ObjectSchema<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.query, {
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

    req.query = value as Request["query"];
    next();
  };
}
