import {
  JobSearchQuery,
  JobSummary,
  PublishedJob,
  RejectedJob,
} from "./job.types";

interface Repository<T> {
  save(entity: T): Promise<T>;

  getAll(): Promise<T[]>;

  getById(id: string): Promise<T | null>;
}

export interface PublishedJobRepository extends Repository<PublishedJob> {
  findBySource(
    sourceName: string,
    sourceId: string,
  ): Promise<PublishedJob | null>;
}

/** Search-index store: summary documents only (OpenSearch/ES seam). */
export interface JobSearchRepository {
  save(summary: JobSummary): Promise<JobSummary>;
  search(query: JobSearchQuery): Promise<JobSummary[]>;
}

export interface RejectedJobRepository extends Repository<RejectedJob> {
  getCount(): Promise<number>;
}
