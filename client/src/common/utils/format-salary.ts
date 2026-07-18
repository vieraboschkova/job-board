import type { Salary } from "../../types/job";

function formatAmount(value: number, currency: string): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: value % 1 === 0 ? 0 : 2,
    }).format(value);
  } catch {
    return `${currency} ${value}`;
  }
}

const UNIT_SUFFIX: Record<Salary["unit"], string> = {
  hourly: "/hr",
  monthly: "/mo",
  annual: "/yr",
  unknown: "",
};

export function formatSalary(salary?: Salary): string {
  if (!salary) {
    return "Salary not listed";
  }

  const { min, max, currency, unit } = salary;
  const suffix = UNIT_SUFFIX[unit];

  if (min != null && max != null && min !== max) {
    return `${formatAmount(min, currency)} – ${formatAmount(max, currency)}${suffix}`;
  }

  const amount = min ?? max;
  if (amount == null) {
    return "Salary not listed";
  }

  return `${formatAmount(amount, currency)}${suffix}`;
}
