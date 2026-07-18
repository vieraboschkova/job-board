import { CountryCode } from "../../../domain/job/job.enums";
import { Location } from "../../../domain/job/job.types";
import { parseLocation, pickFirstValueFromKeys } from "../parsers";
import { LOCATION_FIELDS } from "./field-keys";
import { parseRemoteFlag } from "./parse-remote-flag";

export function resolveLocation(rawJob: Record<string, unknown>): Location {
  const parsed = parseLocation(pickFirstValueFromKeys(rawJob, LOCATION_FIELDS));

  const remoteFlag = parseRemoteFlag(rawJob.remote);

  if (!parsed) {
    return {
      country: CountryCode.Other,
      remote: remoteFlag ?? false,
    };
  }

  if (remoteFlag === undefined) {
    return parsed;
  }

  return {
    ...parsed,
    remote: remoteFlag,
  };
}
