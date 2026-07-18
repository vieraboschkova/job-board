import { CountryCode } from "../../../domain/job/job.enums";
import { Location } from "../../../domain/job/job.types";
import { countryCodeMap } from "../mappers/country-code-map";
import { isRecord } from "./common/is-record";
import { parseString } from "./common/parse-string";

function parseCountry(value: unknown): CountryCode {
  const country = parseString(value)?.toLowerCase();

  if (!country) {
    return CountryCode.Other;
  }

  return countryCodeMap[country] ?? CountryCode.Other;
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
