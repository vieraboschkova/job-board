import { CountryCode } from "../../../domain/job/job.enums";

export const countryCodeMap: Record<string, CountryCode> = {
  usa: CountryCode.US,
  us: CountryCode.US,
  "united states": CountryCode.US,

  canada: CountryCode.CA,
  ca: CountryCode.CA,

  uk: CountryCode.UK,
  "united kingdom": CountryCode.UK,
};
