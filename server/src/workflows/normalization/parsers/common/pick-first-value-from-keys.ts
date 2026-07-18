export const pickFirstValueFromKeys = (
  source: Record<string, unknown>,
  keys: readonly string[],
): unknown => {
  for (const key of keys) {
    const value = source[key];

    if (value === undefined || value === null) {
      continue;
    }

    if (typeof value === "string" && value.trim().length === 0) {
      continue;
    }

    return value;
  }

  return undefined;
};
