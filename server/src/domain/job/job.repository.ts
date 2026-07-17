import { PublishedJob, RejectedJob, JobSearchQuery } from "./job.types";

interface Repository<T> {
  save(entity: T): Promise<T>;

  getAll(): Promise<T[]>;

  getById(id: string): Promise<T | null>;
}

export interface PublishedJobRepository extends Repository<PublishedJob> {
  search(query: JobSearchQuery): Promise<PublishedJob[]>;
}

export interface RejectedJobRepository extends Repository<RejectedJob> {}
