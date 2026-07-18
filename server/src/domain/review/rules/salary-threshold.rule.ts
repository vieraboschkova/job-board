import { SalaryUnit } from "../../job/job.enums";
import { Job } from "../../job/job.types";
import { RejectionReason } from "../review.enums";
import { RejectionDetail, ReviewRule } from "../review.types";

const ANNUAL_THRESHOLD = 100_000;
const HOURLY_THRESHOLD = 45;

function isUsdCurrency(currency: string): boolean {
  const normalized = currency.trim().toUpperCase();

  return normalized === "" || normalized === "USD";
}

export const salaryThresholdRule: ReviewRule = {
  name: "salary_threshold",

  evaluate(job: Job): RejectionDetail[] {
    const { salary } = job;

    if (!salary || salary.min === undefined) {
      return [
        {
          reason: RejectionReason.InvalidSalary,
          details: "Salary is required",
        },
      ];
    }

    if (!isUsdCurrency(salary.currency)) {
      return [
        {
          reason: RejectionReason.InvalidSalary,
          details: "Salary must be in USD",
        },
      ];
    }

    if (salary.unit === SalaryUnit.Annual) {
      if (salary.min > ANNUAL_THRESHOLD) {
        return [];
      }

      return [
        {
          reason: RejectionReason.InvalidSalary,
          details: "Salary below annual threshold",
        },
      ];
    }

    if (salary.unit === SalaryUnit.Hourly) {
      if (salary.min > HOURLY_THRESHOLD) {
        return [];
      }

      return [
        {
          reason: RejectionReason.InvalidSalary,
          details: "Salary below hourly threshold",
        },
      ];
    }

    return [
      {
        reason: RejectionReason.InvalidSalary,
        details: "Salary unit must be annual or hourly",
      },
    ];
  },
};
