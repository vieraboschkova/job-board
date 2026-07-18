import { HealthStatus } from "../constants";
import { HealthChecker } from "./health-checker";

/** Liveness: the Node process is running and can serve requests. */
export class ProcessLivenessHealthChecker implements HealthChecker {
  check(): HealthStatus {
    // TODO: add real checks
    return HealthStatus.Ok;
  }
}
