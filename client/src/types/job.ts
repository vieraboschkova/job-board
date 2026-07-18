export type CountryCode = "US" | "CA" | "UK" | "OTHER";

export type JobSort =
  "salary_asc" | "salary_desc" | "postedAt_asc" | "postedAt_desc";

export type SalaryUnit = "annual" | "hourly" | "monthly" | "unknown";

export type EmploymentType =
  "full_time" | "part_time" | "contract" | "internship" | "unknown";

export type CompanyType =
  "direct_employer" | "staffing_firm" | "consulting_agency" | "unknown";

export type Language =
  | "english"
  | "french"
  | "german"
  | "polish"
  | "spanish"
  | "italian"
  | "unknown";

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

/** Public job from GET /api/jobs/:id (raw source payload omitted). */
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
  postedAt?: string;
  createdAt: string;
}

/** Card fields from GET /api/jobs/search */
export interface JobSummary {
  id: string;
  title: string;
  company: string;
  location: Location;
  employmentType: EmploymentType;
  salary?: Salary;
  postedAt?: string;
}

export interface JobSearchParams {
  search?: string;
  country?: CountryCode;
  sort?: JobSort;
}

export const COUNTRY_OPTIONS: { value: CountryCode; label: string }[] = [
  { value: "US", label: "United States" },
  { value: "CA", label: "Canada" },
  { value: "UK", label: "United Kingdom" },
  { value: "OTHER", label: "Other" },
];

export const SORT_OPTIONS: { value: JobSort; label: string }[] = [
  { value: "salary_desc", label: "Salary (high to low)" },
  { value: "salary_asc", label: "Salary (low to high)" },
  { value: "postedAt_desc", label: "Posted (newest)" },
  { value: "postedAt_asc", label: "Posted (oldest)" },
];
