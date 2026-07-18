import { parseString } from "./common/parse-string";
import { pickFirstValueFromKeys } from "./common/pick-first-value-from-keys";

const DESCRIPTION_FIELDS = ["description", "body", "summary"] as const;

export const parseDescription = (
  raw: Record<string, unknown>,
): string | undefined =>
  parseString(pickFirstValueFromKeys(raw, DESCRIPTION_FIELDS));
