import express from "express";
import { describe, expect, it } from "vitest";
import request from "supertest";

import {
  ApiMountPath,
  ApiRoutePath,
  HealthStatus,
  HttpStatusCode,
} from "../constants";
import { createApp } from "../../app";
import { createHealthRoutes } from "../routes/healthRoutes";
import { toHealthHttpStatusCode } from "../health/to-health-http-status-code";

const HEALTH_URL = `${ApiMountPath.Api}${ApiRoutePath.Health}`;

describe("toHealthHttpStatusCode", () => {
  it("maps ok and degraded to 200", () => {
    expect(toHealthHttpStatusCode(HealthStatus.Ok)).toBe(HttpStatusCode.Ok);
    expect(toHealthHttpStatusCode(HealthStatus.Degraded)).toBe(
      HttpStatusCode.Ok,
    );
  });

  it("maps unhealthy to 503", () => {
    expect(toHealthHttpStatusCode(HealthStatus.Unhealthy)).toBe(
      HttpStatusCode.ServiceUnavailable,
    );
  });
});

describe("GET /api/health", () => {
  it("returns ok from the default liveness checker", async () => {
    const response = await request(createApp()).get(HEALTH_URL);

    expect(response.status).toBe(HttpStatusCode.Ok);
    expect(response.body).toEqual({ status: HealthStatus.Ok });
  });

  it("returns degraded when the checker reports degraded", async () => {
    const app = express();
    app.use(
      ApiMountPath.Api,
      createHealthRoutes({
        check: () => HealthStatus.Degraded,
      }),
    );

    const response = await request(app).get(HEALTH_URL);

    expect(response.status).toBe(HttpStatusCode.Ok);
    expect(response.body).toEqual({ status: HealthStatus.Degraded });
  });

  it("returns unhealthy with 503 when the checker reports unhealthy", async () => {
    const app = express();
    app.use(
      ApiMountPath.Api,
      createHealthRoutes({
        check: () => HealthStatus.Unhealthy,
      }),
    );

    const response = await request(app).get(HEALTH_URL);

    expect(response.status).toBe(HttpStatusCode.ServiceUnavailable);
    expect(response.body).toEqual({ status: HealthStatus.Unhealthy });
  });
});
