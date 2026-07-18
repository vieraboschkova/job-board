import { Job } from "../../../domain/job/job.types";
import { RejectionReason } from "../../../domain/review/review.enums";
import {
  RejectionDetail,
  ReviewRule,
} from "../../../domain/review/review.types";

export const sourceDataRequiredRule: ReviewRule = {
  name: "source_data_required",

  evaluate(job: Job): RejectionDetail[] {
    const hasSourceName = job.sourceName.trim().length > 0;
    const hasSourceId = (job.sourceId?.trim().length ?? 0) > 0;

    if (hasSourceName && hasSourceId) {
      return [];
    }

    return [
      {
        reason: RejectionReason.MissingSourceData,
        details: "sourceName and sourceId are required",
      },
    ];
  },
};
