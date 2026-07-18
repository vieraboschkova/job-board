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

export interface IngestionDuplicate {
  sourceName: string;
  id: string;
  sourceId?: string;
}

export interface IngestionResult {
  receivedCount: number;
  normalizedCount: number;
  approvedCount: number;
  rejectedCount: number;
  duplicatesCount: number;
  duplicates: IngestionDuplicate[];
  errors: IngestionError[];
}

export interface IngestionError {
  index: number;
  message: string;
}
