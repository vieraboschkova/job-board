import { CountryCode } from "../../../domain/job/job.enums";
import { Job } from "../../../domain/job/job.types";
import { RejectionReason } from "../../../domain/review/review.enums";
import {
  RejectionDetail,
  ReviewRule,
} from "../../../domain/review/review.types";

const ALLOWED_COUNTRIES = new Set<CountryCode>([
  CountryCode.US,
  CountryCode.CA,
]);

export const allowedLocationRule: ReviewRule = {
  name: "allowed_location",

  evaluate(job: Job): RejectionDetail[] {
    if (job.location.remote || ALLOWED_COUNTRIES.has(job.location.country)) {
      return [];
    }

    return [
      {
        reason: RejectionReason.InvalidLocation,
        details: "Job must be remote or located in the US or Canada",
      },
    ];
  },
};
