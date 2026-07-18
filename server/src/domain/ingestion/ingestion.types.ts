import { Job } from "../job/job.types";

export type RawJobPosting = Record<string, unknown>;

export interface JobNormalizer {
  normalize(rawJob: RawJobPosting, sourceName: string): Job;
}

export interface JobIngester {
  ingest(
    rawJobs: RawJobPosting[],
    sourceName: string,
  ): Promise<IngestionResult>;
}

export interface IngestionResult {
  receivedCount: number;
  normalizedCount: number;
  approvedCount: number;
  rejectedCount: number;
  errors: IngestionError[];
}

export interface IngestionError {
  index: number;
  message: string;
}
