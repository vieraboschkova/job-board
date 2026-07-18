import { NextFunction, Request, Response } from "express";

import { HttpStatusCode, IngestRequestField } from "../constants";
import { JobIngestionService } from "../../domain/ingestion/ingestion.types";
import { logger } from "../../shared/logger";
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
      const sourceName = body[IngestRequestField.SourceName];

      const result = await ingestionService.ingest(
        body[IngestRequestField.Jobs],
        sourceName,
      );

      logger.success("Ingestion completed", {
        sourceName,
        receivedCount: result.receivedCount,
        normalizedCount: result.normalizedCount,
        approvedCount: result.approvedCount,
        rejectedCount: result.rejectedCount,
        errorCount: result.errors.length,
      });

      res.status(HttpStatusCode.Ok).json(result);
    } catch (error) {
      next(error);
    }
  };
}
