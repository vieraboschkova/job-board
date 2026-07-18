import { parseString } from "./common/parse-string";
import { pickFirstValueFromKeys } from "./common/pick-first-value-from-keys";

const TITLE_FIELDS = ["title", "jobTitle", "position", "role"] as const;

export const parseTitle = (raw: Record<string, unknown>): string | undefined =>
  parseString(pickFirstValueFromKeys(raw, TITLE_FIELDS));
