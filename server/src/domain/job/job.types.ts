import { RejectionDetail } from "../approval/approval.types";
import {
  CountryCode,
  EmploymentType,
  JobSort,
  JobStatus,
  SalaryUnit,
} from "./job.enums";

export interface NormalizedSalary {
  min?: number;

  max?: number;

  currency: string;

  unit: SalaryUnit;
}

export interface NormalizedLocation {
  country: CountryCode;

  city?: string;

  remote: boolean;
}

export interface NormalizedJobPosting {
  id: string;

  title: string;

  company: string;

  description: string;

  location: NormalizedLocation;

  salary?: NormalizedSalary;

  employmentType: EmploymentType;

  sourceName: string;

  rawData: Record<string, unknown>;

  postedAt?: Date;

  createdAt: Date;

  status: JobStatus;
}

export interface RejectedJob extends NormalizedJobPosting {
  status: JobStatus.Rejected;

  rejectedAt: Date;

  rejectionReasons: RejectionDetail[];
}

export interface JobSearchQuery {
  search?: string;

  country?: CountryCode;

  sort?: JobSort;

  limit?: number;

  offset?: number;
}
