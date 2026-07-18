import { apiGet } from "./client";
import type { Job, JobSearchParams, JobSummary } from "../types/job";

const JOBS_PATH = "/api/jobs";
const JOBS_SEARCH_PATH = "/api/jobs/search";

export function buildJobsSearchPath(params: JobSearchParams = {}): string {
  const query = new URLSearchParams();

  const search = params.search?.trim();
  if (search) {
    query.set("search", search);
  }
  if (params.country) {
    query.set("country", params.country);
  }
  if (params.sort) {
    query.set("sort", params.sort);
  }

  const queryString = query.toString();
  return queryString ? `${JOBS_SEARCH_PATH}?${queryString}` : JOBS_SEARCH_PATH;
}

export function fetchJobs(params: JobSearchParams = {}): Promise<JobSummary[]> {
  return apiGet<JobSummary[]>(buildJobsSearchPath(params));
}

export function fetchJobById(id: string): Promise<Job> {
  return apiGet<Job>(`${JOBS_PATH}/${encodeURIComponent(id)}`);
}
