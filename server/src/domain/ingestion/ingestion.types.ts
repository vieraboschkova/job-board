import { Job } from "../job/job.types";

export type RawJobPosting = Record<string, unknown>;

export interface JobNormalizer {
  normalize(rawJob: RawJobPosting, sourceName: string): Job;
}

export interface IngestionResult {
  receivedCount: number;
  // TODO: move to review counters
  // approvedCount: number;

  // rejectedCount: number;

  errors: IngestionError[];
}

export interface IngestionError {
  index: number;

  message: string;
}
