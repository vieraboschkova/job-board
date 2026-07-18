import { NextFunction, Request, Response } from "express";
import { HealthChecker } from "../health/health-checker";
import { ProcessLivenessHealthChecker } from "../health/process-liveness-health-checker";
import { toHealthHttpStatusCode } from "../health/to-health-http-status-code";

export function createHealthController(
  healthChecker: HealthChecker = new ProcessLivenessHealthChecker(),
) {
  return async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const status = await healthChecker.check();
      res.status(toHealthHttpStatusCode(status)).json({ status });
    } catch (error) {
      next(error);
    }
  };
}
