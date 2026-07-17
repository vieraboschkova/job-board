import { ApprovedJob, JobSearchQuery, RejectedJob } from "./job.types";

export interface JobRepository {
  save(job: ApprovedJob): Promise<void>;

  search(query: JobSearchQuery): Promise<ApprovedJob[]>;

  findById(id: string): Promise<ApprovedJob | null>;
}

export interface RejectedJobRepository {
  save(job: RejectedJob): Promise<void>;

  findAll(): Promise<RejectedJob[]>;
}
