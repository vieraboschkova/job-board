import { DESCRIPTION_FIELDS } from "../utils/field-keys";
import { parseString } from "./common/parse-string";
import { pickFirstValueFromKeys } from "./common/pick-first-value-from-keys";

export const parseDescription = (
  raw: Record<string, unknown>,
): string | undefined =>
  parseString(pickFirstValueFromKeys(raw, DESCRIPTION_FIELDS));
