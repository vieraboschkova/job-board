import { Router } from "express";

import { ApiRoutePath } from "../constants";
import { createPublishedJobController } from "../controllers/publishedJobController";
import { validateRequestQuery } from "../middleware";
import { PublishedJobsReader } from "../../domain/job/job.types";
import { jobsQuerySchema } from "../schemas/jobs-query.schema";

export function createPublishedJobRoutes(
  publishedJobsReader: PublishedJobsReader,
): Router {
  const router = Router();
  const controller = createPublishedJobController({ publishedJobsReader });

  router.get(ApiRoutePath.Jobs, controller.getAll);
  router.get(
    ApiRoutePath.JobsSearch,
    validateRequestQuery(jobsQuerySchema),
    controller.search,
  );
  router.get(ApiRoutePath.JobById, controller.getById);

  return router;
}
