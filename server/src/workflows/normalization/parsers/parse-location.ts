import { CountryCode } from "../../../domain/job/job.enums";
import { Location } from "../../../domain/job/job.types";
import { isRecord } from "./common/is-record";
import { parseString } from "./common/parse-string";

function parseCountry(value: unknown): CountryCode {
  const country = parseString(value)?.toLowerCase();

  switch (country) {
    case "usa":
    case "us":
    case "united states":
      return CountryCode.US;

    case "canada":
    case "ca":
      return CountryCode.CA;

    case "uk":
    case "united kingdom":
      return CountryCode.UK;

    default:
      return CountryCode.Other;
  }
}

export function parseLocation(value: unknown): Location | undefined {
  if (typeof value === "string") {
    const location = parseString(value);

    if (!location) {
      return undefined;
    }

    if (location.toLowerCase() === "remote") {
      return {
        country: CountryCode.Other,
        remote: true,
      };
    }

    const parts = location
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    return {
      city: parts[0],
      country: parseCountry(parts.at(-1)),
      remote: false,
    };
  }

  if (!isRecord(value)) {
    return undefined;
  }

  return {
    city: parseString(value.city),
    country: parseCountry(value.country),
    remote: false,
  };
}
