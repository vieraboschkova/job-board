import { Job, JobSearchQuery } from "./job.types";

export interface JobRepository {
  save(job: Job): Promise<Job>;

  search(query: JobSearchQuery): Promise<Job[]>;

  findAll(): Promise<Job[]>;

  findById(id: string): Promise<Job | null>;
}
