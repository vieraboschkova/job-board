import { describe, expect, it, vi } from "vitest";
import { ApiError, apiGet } from "../client";

describe("apiGet", () => {
  it("returns parsed JSON on success", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ status: "ok" }),
      }),
    );

    await expect(apiGet<{ status: string }>("/api/health")).resolves.toEqual({
      status: "ok",
    });
  });

  it("throws ApiError with server error message", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({
          error: {
            code: "INVALID_REQUEST_BODY",
            message: "Invalid request body",
            details: ["search must be a string"],
          },
        }),
      }),
    );

    await expect(apiGet("/api/jobs/search")).rejects.toEqual(
      expect.objectContaining({
        name: "ApiError",
        message: "search must be a string",
        status: 400,
      }),
    );
    expect(ApiError).toBeDefined();
  });

  it("falls back to status message when body is not JSON", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 503,
        json: async () => {
          throw new Error("not json");
        },
      }),
    );

    await expect(apiGet("/api/jobs/search")).rejects.toMatchObject({
      message: "Request failed with status 503",
      status: 503,
    });
  });
});
