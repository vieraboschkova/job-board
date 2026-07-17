import { parseString } from "./common/parse-string";

export function parsePostingDate(value: unknown): Date | undefined {
  const raw = parseString(value);

  if (!raw) {
    return undefined;
  }

  const date = new Date(raw);

  return Number.isNaN(date.getTime()) ? undefined : date;
}
