import { HealthStatus } from "../constants";

export interface HealthChecker {
  check(): HealthStatus | Promise<HealthStatus>;
}
