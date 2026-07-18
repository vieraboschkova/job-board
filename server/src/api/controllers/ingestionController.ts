import { NextFunction, Request, Response } from "express";

import { HttpStatusCode, IngestRequestField } from "../constants";
import { JobIngestionService } from "../../domain/ingestion/ingestion.types";
import { IngestRequestBody } from "../schemas/ingest-request.schema";

export function createIngestionController(
  ingestionService: JobIngestionService,
) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const body = req.body as IngestRequestBody;

      const result = await ingestionService.ingest(
        body[IngestRequestField.Jobs],
        body[IngestRequestField.SourceName],
      );

      res.status(HttpStatusCode.Ok).json(result);
    } catch (error) {
      next(error);
    }
  };
}
