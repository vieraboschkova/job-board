import { TITLE_FIELDS } from "../utils/field-keys";
import { parseString } from "./common/parse-string";
import { pickFirstValueFromKeys } from "./common/pick-first-value-from-keys";

export const parseTitle = (raw: Record<string, unknown>): string | undefined =>
  parseString(pickFirstValueFromKeys(raw, TITLE_FIELDS));
