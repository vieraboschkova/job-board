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

export interface JobReader {
  getAll(): Promise<JobDetail[]>;
  search(query: JobSearchQueryInput): Promise<JobSummary[]>;
  getById(id: string): Promise<JobDetail | null>;
}
