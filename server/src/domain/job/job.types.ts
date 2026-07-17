import { EmploymentType, JobSort, JobStatus, SalaryPeriod } from "./job.enums";

import { RejectionReason } from "../approval/approval.enums";

export interface Job {
  id: string;

  title: string;

  company: string;

  description: string;

  country?: string;

  location?: string;

  salary?: {
    min?: number;
    max?: number;
    currency?: string;
    period?: SalaryPeriod;
  };

  technologies: string[];

  employmentType?: EmploymentType;

  url?: string;

  postedAt: Date;

  createdAt: Date;
}

export interface ApprovedJob extends Job {
  status: JobStatus.Approved;

  approvedAt: Date;
}

export interface RejectedJob extends Job {
  status: JobStatus.Rejected;

  rejectedAt: Date;

  rejectionReasons: RejectionReason[];
}

export interface JobSearchQuery {
  title?: string;

  country?: string;

  sort?: JobSort;

  limit?: number;

  offset?: number;
}
