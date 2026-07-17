export enum EmploymentType {
  FullTime = "full_time",
  PartTime = "part_time",
  Contract = "contract",
  Internship = "internship",
  Unknown = "unknown",
}

export enum CountryCode {
  US = "US",
  CA = "CA",
  UK = "UK",
  Other = "OTHER",
}

export enum SalaryUnit {
  Annual = "annual",
  Hourly = "hourly",
  Monthly = "monthly",
  Unknown = "unknown",
}

export enum JobStatus {
  Approved = "approved",
  Rejected = "rejected",
  Pending = "pending",
}

export enum JobSort {
  SalaryAscending = "salary_asc",
  SalaryDescending = "salary_desc",
  PostedAtAscending = "postedAt_asc",
  PostedAtDescending = "postedAt_desc",
}
