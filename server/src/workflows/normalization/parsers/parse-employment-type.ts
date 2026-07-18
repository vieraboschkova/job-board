import { EmploymentType } from "../../../domain/job/job.enums";
import { employmentTypeMap } from "../mappers/employment-type-map";
import { parseString } from "./common/parse-string";

export function parseEmploymentType(value: unknown): EmploymentType {
  const normalized = parseString(value)?.toLowerCase();

  if (!normalized) {
    return EmploymentType.Unknown;
  }

  return employmentTypeMap[normalized] ?? EmploymentType.Unknown;
}
