import { Router } from "express";
import swaggerUi from "swagger-ui-express";

import { ApiRoutePath, HttpStatusCode } from "../constants";
import { openApiDocument } from "../docs/openapi";

export function createDocsRoutes(): Router {
  const router = Router();

  router.get(ApiRoutePath.DocsJson, (_req, res) => {
    res.status(HttpStatusCode.Ok).json(openApiDocument);
  });

  router.use(
    ApiRoutePath.Docs,
    swaggerUi.serve,
    swaggerUi.setup(openApiDocument),
  );

  return router;
}
