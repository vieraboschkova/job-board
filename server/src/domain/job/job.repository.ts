import {
  NormalizedJobPosting,
  JobSearchQuery,
  RejectedJob,
} from "./job.types";


export interface JobRepository {
  save(job: NormalizedJobPosting): Promise<NormalizedJobPosting>;

  search(query: JobSearchQuery): Promise<NormalizedJobPosting[]>;

  findAll(): Promise<NormalizedJobPosting[]>;

  findById(id: string): Promise<NormalizedJobPosting | null>;
}


export interface RejectedJobRepository {
  save(job: RejectedJob): Promise<RejectedJob>;

  findAll(): Promise<RejectedJob[]>;
}