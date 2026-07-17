import { RejectionDetail } from "../review/review.types";
import { CountryCode, EmploymentType, SalaryUnit, JobSort } from "./job.enums";

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

  location: Location;

  salary?: Salary;

  employmentType: EmploymentType;
  sourceName: string;
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

export interface PublishedJob {
  job: Job;
  publishedAt: Date;
}

export interface RejectedJob {
  job: Job;
  rejectedAt: Date;
  rejectionReasons: RejectionDetail[];
}
