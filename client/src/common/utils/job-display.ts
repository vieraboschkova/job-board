import { formatDate } from "./format-date";
import { formatSalary } from "./format-salary";
import type {
  CompanyType,
  EmploymentType,
  JobSummary,
  Language,
  Salary,
} from "../../types/job";

const EMPLOYMENT_TYPE_LABELS: Record<EmploymentType, string> = {
  full_time: "Full-time",
  part_time: "Part-time",
  contract: "Contract",
  internship: "Internship",
  unknown: "Unknown",
};

const COMPANY_TYPE_LABELS: Record<CompanyType, string> = {
  direct_employer: "Direct employer",
  staffing_firm: "Staffing firm",
  consulting_agency: "Consulting agency",
  unknown: "Unknown",
};

const LANGUAGE_LABELS: Record<Language, string> = {
  english: "English",
  french: "French",
  german: "German",
  polish: "Polish",
  spanish: "Spanish",
  italian: "Italian",
  unknown: "Unknown",
};

export function formatLocation(job: Pick<JobSummary, "location">): string {
  const parts: string[] = [];
  if (job.location.city) {
    parts.push(job.location.city);
  }
  parts.push(job.location.country);
  if (job.location.remote) {
    parts.push("Remote");
  }
  return parts.join(" · ");
}

export function formatEmploymentType(type: EmploymentType): string {
  return EMPLOYMENT_TYPE_LABELS[type];
}

export function formatCompanyType(type: CompanyType): string {
  return COMPANY_TYPE_LABELS[type];
}

export function formatLanguage(language: Language): string {
  return LANGUAGE_LABELS[language];
}

export function formatOptionalDate(
  value?: string,
  fallback = "Unknown",
): string {
  if (!value) {
    return fallback;
  }
  try {
    return formatDate(value);
  } catch {
    return fallback;
  }
}

export function formatJobSalary(job: { salary?: Salary }): string {
  return formatSalary(job.salary);
}
