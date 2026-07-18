import { Router } from "express";

import { ApiRoutePath } from "../constants";
import { createJobController } from "../controllers/jobController";
import { validateRequestQuery } from "../middleware";
import { JobReader } from "../../domain/job/job.types";
import { jobsQuerySchema } from "../schemas/jobs-query.schema";

export function createJobRoutes(jobReader: JobReader): Router {
  const router = Router();
  const controller = createJobController({ jobReader });

  router.get(ApiRoutePath.Jobs, controller.getAll);
  router.get(
    ApiRoutePath.JobsSearch,
    validateRequestQuery(jobsQuerySchema),
    controller.search,
  );
  router.get(ApiRoutePath.JobById, controller.getById);

  return router;
}
