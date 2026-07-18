import { RejectionDetail } from "../review/review.types";
import {
  CompanyType,
  CountryCode,
  EmploymentType,
  SalaryUnit,
  JobSort,
  Language,
} from "./job.enums";

export interface Salary {
  min?: number;

  max?: number;

  currency: string;

  unit: SalaryUnit;
}

export interface Location {
  country: CountryCode;

  city?: string;

  remote: boolean;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  language: Language;
  location: Location;

  salary?: Salary;

  employmentType: EmploymentType;
  companyType: CompanyType;
  sourceName: string;
  sourceId?: string;
  rawData: Record<string, unknown>;

  postedAt?: Date;
  createdAt: Date;
}

/** Fields returned by job search / list cards. Full details via getById. */
export interface JobSummary {
  id: string;
  title: string;
  company: string;
  location: Location;
  employmentType: EmploymentType;
  salary?: Salary;
  postedAt?: Date;
}

/** Public job detail: omits raw ingestion payload. */
export type JobDetail = Omit<Job, "rawData">;

export interface JobSearchQuery {
  search?: string;

  country?: CountryCode;

  sort?: JobSort;

  limit?: number;

  offset?: number;
}

/** Raw query strings from the API layer before enum/normalization. */
export interface JobSearchQueryInput {
  search?: string;
  country?: string;
  sort?: string;
}

export interface PublishedJob {
  job: Job;
  publishedAt: Date;
}

export interface RejectedJob {
  job: Job;
  rejectedAt: Date;
  rejectionReasons: RejectionDetail[];
}

/** Rule-relevant job fields nested under a rejection list item. */
export interface RejectionJobSummary {
  title: string;
  language: Language;
  location: Location;
  employmentType: EmploymentType;
  salary?: Salary;
  companyType: CompanyType;
  company: string;
}

/** Debug list item for rejected jobs. */
export interface RejectionSummary {
  id: string;
  sourceName: string;
  rejectedAt: Date;
  rejectionReasons: RejectionDetail[];
  job: RejectionJobSummary;
}

export interface PublishedJobsReader {
  getAll(): Promise<JobDetail[]>;
  search(query: JobSearchQueryInput): Promise<JobSummary[]>;
  getById(id: string): Promise<JobDetail | null>;
}

export interface RejectedJobsReader {
  getAll(): Promise<RejectionSummary[]>;
}
