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
  getAll(): Promise<Job[]>;
  search(query: JobSearchQueryInput): Promise<Job[]>;
  getById(id: string): Promise<Job | null>;
}
