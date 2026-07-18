import { CountryCode, Language } from "../../../domain/job/job.enums";
import { Job } from "../../../domain/job/job.types";
import { RejectionReason } from "../../../domain/review/review.enums";
import {
  RejectionDetail,
  ReviewRule,
} from "../../../domain/review/review.types";

export const allowedLanguageRule: ReviewRule = {
  name: "allowed_language",

  evaluate(job: Job): RejectionDetail[] {
    if (job.language === Language.English) {
      return [];
    }

    if (
      job.language === Language.French &&
      job.location.country === CountryCode.CA
    ) {
      return [];
    }

    return [
      {
        reason: RejectionReason.InvalidLanguage,
        details: "Language must be English, or French for jobs in Canada",
      },
    ];
  },
};
