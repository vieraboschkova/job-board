import { HealthStatus, HttpStatusCode } from "../constants";

export function toHealthHttpStatusCode(status: HealthStatus): HttpStatusCode {
  switch (status) {
    case HealthStatus.Ok:
    case HealthStatus.Degraded:
      return HttpStatusCode.Ok;
    default:
      return HttpStatusCode.ServiceUnavailable;
  }
}
