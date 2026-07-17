import { EmploymentType } from "../../../domain/job/job.enums";
import { parseString } from "./common/parse-string";

const employmentTypeMap: Record<string, EmploymentType> = {
  "full-time": EmploymentType.FullTime,
  "full time": EmploymentType.FullTime,
  fulltime: EmploymentType.FullTime,

  "part-time": EmploymentType.PartTime,
  "part time": EmploymentType.PartTime,
  parttime: EmploymentType.PartTime,

  contract: EmploymentType.Contract,

  internship: EmploymentType.Internship,
};

export function parseEmploymentType(value: unknown): EmploymentType {
  const normalized = parseString(value)?.toLowerCase();

  if (!normalized) {
    return EmploymentType.Unknown;
  }

  return employmentTypeMap[normalized] ?? EmploymentType.Unknown;
}
