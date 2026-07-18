import { Router } from "express";

import { ApiRoutePath } from "../constants";
import { createIngestionController } from "../controllers/ingestionController";
import { validateRequestBody } from "../middleware";
import { JobIngester } from "../../domain/ingestion/ingestion.types";
import { ingestRequestSchema } from "../schemas/ingest-request.schema";

export function createIngestionRoutes(ingestionService: JobIngester): Router {
  const router = Router();
  const controller = createIngestionController(ingestionService);

  router.post(
    ApiRoutePath.Ingest,
    validateRequestBody(ingestRequestSchema),
    controller,
  );

  return router;
}
