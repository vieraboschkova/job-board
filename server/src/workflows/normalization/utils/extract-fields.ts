import {
  CompanyType,
  EmploymentType,
  Language,
} from "../../../domain/job/job.enums";
import { Salary } from "../../../domain/job/job.types";
import {
  parseCompanyType,
  parseEmploymentType,
  parseLanguage,
  parsePostingDate,
  parseSalary,
  parseString,
  pickFirstValueFromKeys,
} from "../parsers";
import {
  COMPANY_TYPE_FIELDS,
  EMPLOYMENT_TYPE_FIELDS,
  LANGUAGE_FIELDS,
  POSTING_DATE_FIELDS,
  SALARY_FIELDS,
  SOURCE_ID_FIELDS,
} from "./field-keys";

export function extractSourceId(
  rawJob: Record<string, unknown>,
): string | undefined {
  const value = pickFirstValueFromKeys(rawJob, SOURCE_ID_FIELDS);

  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }

  return parseString(value);
}

export function extractEmploymentType(
  rawJob: Record<string, unknown>,
): EmploymentType {
  return parseEmploymentType(
    pickFirstValueFromKeys(rawJob, EMPLOYMENT_TYPE_FIELDS),
  );
}

export function extractCompanyType(
  rawJob: Record<string, unknown>,
): CompanyType {
  return parseCompanyType(pickFirstValueFromKeys(rawJob, COMPANY_TYPE_FIELDS));
}

export function extractSalary(
  rawJob: Record<string, unknown>,
): Salary | undefined {
  return parseSalary(pickFirstValueFromKeys(rawJob, SALARY_FIELDS));
}

export function extractPostedAt(
  rawJob: Record<string, unknown>,
): Date | undefined {
  return parsePostingDate(pickFirstValueFromKeys(rawJob, POSTING_DATE_FIELDS));
}

export function extractLanguage(
  rawJob: Record<string, unknown>,
  fallbackText: string,
): Language {
  return parseLanguage(
    pickFirstValueFromKeys(rawJob, LANGUAGE_FIELDS),
    fallbackText,
  );
}
