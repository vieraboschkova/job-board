import { EmploymentType } from "../../../domain/job/job.enums";

export const employmentTypeMap: Record<string, EmploymentType> = {
  "full-time": EmploymentType.FullTime,
  "full time": EmploymentType.FullTime,
  fulltime: EmploymentType.FullTime,

  "part-time": EmploymentType.PartTime,
  "part time": EmploymentType.PartTime,
  parttime: EmploymentType.PartTime,

  contract: EmploymentType.Contract,

  internship: EmploymentType.Internship,
};
