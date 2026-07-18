import { Router } from "express";

import { ApiRoutePath } from "../constants";
import { createHealthController } from "../controllers/healthController";
import { HealthChecker } from "../health/health-checker";
import { ProcessLivenessHealthChecker } from "../health/process-liveness-health-checker";

export function createHealthRoutes(
  healthChecker: HealthChecker = new ProcessLivenessHealthChecker(),
): Router {
  const router = Router();

  router.get(ApiRoutePath.Health, createHealthController(healthChecker));

  return router;
}
