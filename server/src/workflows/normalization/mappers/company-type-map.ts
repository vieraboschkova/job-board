import { CompanyType } from "../../../domain/job/job.enums";

export const companyTypeMap: Record<string, CompanyType> = {
  "direct employer": CompanyType.DirectEmployer,
  "staffing firm": CompanyType.StaffingFirm,
  "consulting agency": CompanyType.ConsultingAgency,
};
