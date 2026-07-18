import { isRecord } from "./common/is-record";
import { parseString } from "./common/parse-string";
import { pickFirstValueFromKeys } from "./common/pick-first-value-from-keys";

const COMPANY_FIELDS = ["company", "companyName"] as const;

const EMPLOYER_FIELDS = ["name", "company", "companyName"] as const;

export const parseCompany = (
  raw: Record<string, unknown>,
): string | undefined => {
  const company = parseString(pickFirstValueFromKeys(raw, COMPANY_FIELDS));

  if (company) {
    return company;
  }

  if (!isRecord(raw.employer)) {
    return undefined;
  }

  return parseString(pickFirstValueFromKeys(raw.employer, EMPLOYER_FIELDS));
};
