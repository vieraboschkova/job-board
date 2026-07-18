import { Router } from "express";

import { ApiRoutePath } from "../constants";
import { createRejectedJobController } from "../controllers/rejectedJobController";
import { RejectedJobsReader } from "../../domain/job/job.types";

export function createRejectedJobRoutes(
  rejectedJobsReader: RejectedJobsReader,
): Router {
  const router = Router();
  const controller = createRejectedJobController(rejectedJobsReader);

  router.get(ApiRoutePath.Rejections, controller.getAll);

  return router;
}
