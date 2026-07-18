import { COMPANY_FIELDS } from "../utils/field-keys";
import { isRecord } from "./common/is-record";
import { parseString } from "./common/parse-string";
import { pickFirstValueFromKeys } from "./common/pick-first-value-from-keys";

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

  return parseString(pickFirstValueFromKeys(raw.employer, COMPANY_FIELDS));
};
