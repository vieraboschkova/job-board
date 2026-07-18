import { CompanyType } from "../../../domain/job/job.enums";
import { parseString } from "./common/parse-string";

const companyTypeMap: Record<string, CompanyType> = {
  "direct employer": CompanyType.DirectEmployer,
  "staffing firm": CompanyType.StaffingFirm,
  "consulting agency": CompanyType.ConsultingAgency,
};

export function parseCompanyType(value: unknown): CompanyType {
  const normalized = parseString(value)?.toLowerCase();

  if (!normalized) {
    return CompanyType.Unknown;
  }

  return companyTypeMap[normalized] ?? CompanyType.Unknown;
}
