import { CountryCode, Language } from "../../job/job.enums";
import { Job } from "../../job/job.types";
import { RejectionReason } from "../review.enums";
import { RejectionDetail, ReviewRule } from "../review.types";

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
