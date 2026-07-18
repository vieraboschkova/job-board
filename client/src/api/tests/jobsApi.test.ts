import { describe, expect, it, vi } from "vitest";
import { buildJobsSearchPath, fetchJobById, fetchJobs } from "../jobsApi";

describe("buildJobsSearchPath", () => {
  it("returns base path when params are empty", () => {
    expect(buildJobsSearchPath()).toBe("/api/jobs/search");
    expect(buildJobsSearchPath({ search: "  " })).toBe("/api/jobs/search");
  });

  it("includes trimmed search, country, and sort", () => {
    expect(
      buildJobsSearchPath({
        search: "  engineer  ",
        country: "US",
        sort: "salary_desc",
      }),
    ).toBe("/api/jobs/search?search=engineer&country=US&sort=salary_desc");
  });
});

describe("fetchJobs", () => {
  it("calls apiGet with the search path", async () => {
    const jobs = [{ id: "1", title: "Engineer" }];
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => jobs,
      }),
    );

    await expect(fetchJobs({ search: "eng", country: "CA" })).resolves.toEqual(
      jobs,
    );
    expect(fetch).toHaveBeenCalledWith(
      "/api/jobs/search?search=eng&country=CA",
      undefined,
    );
  });
});

describe("fetchJobById", () => {
  it("calls apiGet with the job id path", async () => {
    const job = { id: "job-1", title: "Engineer" };
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => job,
      }),
    );

    await expect(fetchJobById("job-1")).resolves.toEqual(job);
    expect(fetch).toHaveBeenCalledWith("/api/jobs/job-1", undefined);
  });
});
