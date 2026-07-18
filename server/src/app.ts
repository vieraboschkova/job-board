import path from "path";
import cors from "cors";
import express from "express";

import { ApiMountPath, NodeEnv } from "./api/constants";
import { apiNotFound, errorHandler } from "./api/middleware";
import { createDocsRoutes } from "./api/routes/docsRoutes";
import { createHealthRoutes } from "./api/routes/healthRoutes";
import { createIngestionRoutes } from "./api/routes/ingestionRoutes";
import { createPublishedJobRoutes } from "./api/routes/publishedJobRoutes";
import { createRejectedJobRoutes } from "./api/routes/rejectedJobRoutes";
import {
  AppDependencies,
  createDefaultDependencies,
} from "./create-app-dependencies";

export type { AppDependencies } from "./create-app-dependencies";
export { createDefaultDependencies } from "./create-app-dependencies";

export function createApp(deps: AppDependencies = createDefaultDependencies()) {
  const app = express();

  if (process.env.NODE_ENV !== NodeEnv.Production) {
    app.use(cors());
  }

  app.use(express.json());
  app.use(ApiMountPath.Api, createHealthRoutes());
  app.use(ApiMountPath.Api, createIngestionRoutes(deps.ingestionService));
  app.use(ApiMountPath.Api, createPublishedJobRoutes(deps.publishedJobsReader));
  app.use(ApiMountPath.Api, createRejectedJobRoutes(deps.rejectedJobsReader));
  app.use(ApiMountPath.Api, createDocsRoutes());
  app.use(ApiMountPath.Api, apiNotFound);

  if (process.env.NODE_ENV === NodeEnv.Production) {
    const distPath = path.join(__dirname, "..", "..", "client", "dist");
    app.use(express.static(distPath));

    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.use(errorHandler);

  return app;
}
