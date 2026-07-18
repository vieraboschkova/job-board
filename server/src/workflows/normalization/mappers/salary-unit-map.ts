import { SalaryUnit } from "../../../domain/job/job.enums";

export const salaryUnitMap: Record<string, SalaryUnit> = {
  hour: SalaryUnit.Hourly,
  hourly: SalaryUnit.Hourly,

  month: SalaryUnit.Monthly,
  monthly: SalaryUnit.Monthly,

  year: SalaryUnit.Annual,
  yearly: SalaryUnit.Annual,
  annual: SalaryUnit.Annual,
  annually: SalaryUnit.Annual,
};
