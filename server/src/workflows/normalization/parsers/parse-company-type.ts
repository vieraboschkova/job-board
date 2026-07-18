import { CompanyType } from "../../../domain/job/job.enums";
import { companyTypeMap } from "../mappers/company-type-map";
import { parseString } from "./common/parse-string";

export function parseCompanyType(value: unknown): CompanyType {
  const normalized = parseString(value)?.toLowerCase();

  if (!normalized) {
    return CompanyType.Unknown;
  }

  return companyTypeMap[normalized] ?? CompanyType.Unknown;
}
