export function parseNumber(value: unknown): number | undefined {
  if (typeof value !== "number") {
    return undefined;
  }

  return Number.isFinite(value) ? value : undefined;
}
