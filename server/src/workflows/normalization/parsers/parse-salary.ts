import { SalaryUnit } from "../../../domain/job/job.enums";
import { Salary } from "../../../domain/job/job.types";
import { isRecord } from "./common/is-record";
import { parseNumber } from "./common/parse-number";
import { parseString } from "./common/parse-string";

function parseSalaryUnit(value: unknown): SalaryUnit {
  const unit = parseString(value)?.toLowerCase();

  switch (unit) {
    case "hour":
    case "hourly":
      return SalaryUnit.Hourly;

    case "month":
    case "monthly":
      return SalaryUnit.Monthly;

    case "year":
    case "yearly":
    case "annual":
    case "annually":
      return SalaryUnit.Annual;

    default:
      return SalaryUnit.Unknown;
  }
}

function parseCurrency(value: unknown): string {
  return parseString(value) ?? "";
}

function parseSalaryString(value: string): Salary | undefined {
  const normalized = value.replace(/,/g, "").trim();

  const currency = normalized.includes("$") ? "USD" : "";

  const unit = normalized.includes("/hour")
    ? SalaryUnit.Hourly
    : SalaryUnit.Annual;

  const cleanValue = normalized.replace("$", "").replace("/hour", "").trim();

  const rangeMatch = cleanValue.match(
    /^(\d+(?:\.\d+)?)(k?)\s*-\s*(\d+(?:\.\d+)?)(k?)$/i,
  );

  if (rangeMatch) {
    const min = Number(rangeMatch[1]) * (rangeMatch[2] ? 1000 : 1);

    const max = Number(rangeMatch[3]) * (rangeMatch[4] ? 1000 : 1);

    return {
      min,
      max,
      currency,
      unit,
    };
  }

  const valueMatch = cleanValue.match(/^(\d+(?:\.\d+)?)(k?)$/i);

  if (!valueMatch) {
    return undefined;
  }

  return {
    min: Number(valueMatch[1]) * (valueMatch[2] ? 1000 : 1),
    currency,
    unit,
  };
}

function parseSalaryObject(value: Record<string, unknown>): Salary | undefined {
  const min = parseNumber(value.min) ?? parseNumber(value.value);

  if (min === undefined) {
    return undefined;
  }

  const max = parseNumber(value.max);

  const unit = parseSalaryUnit(value.unit ?? value.period);

  return {
    min,
    ...(max !== undefined ? { max } : {}),
    currency: parseCurrency(value.currency),
    unit: unit === SalaryUnit.Unknown ? SalaryUnit.Annual : unit,
  };
}

export function parseSalary(value: unknown): Salary | undefined {
  if (typeof value === "number") {
    return {
      min: value,
      currency: "",
      unit: SalaryUnit.Annual,
    };
  }

  if (typeof value === "string") {
    return parseSalaryString(value);
  }

  if (!isRecord(value)) {
    return undefined;
  }

  return parseSalaryObject(value);
}
