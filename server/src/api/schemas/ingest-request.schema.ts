import Joi from "joi";

import { IngestRequestField } from "../constants";
import { RawJobPosting } from "../../domain/ingestion/ingestion.types";

export interface IngestRequestBody {
  [IngestRequestField.SourceName]: string;
  [IngestRequestField.Jobs]: RawJobPosting[];
}

const MIN_SOURCE_NAME_LENGTH = 1;
/** Soft cap so a single request cannot flood normalize/review within the JSON body limit. */
export const MAX_JOBS_PER_INGEST_BATCH = 1000;

export const ingestRequestSchema = Joi.object<IngestRequestBody>({
  [IngestRequestField.SourceName]: Joi.string()
    .trim()
    .min(MIN_SOURCE_NAME_LENGTH)
    .required(),
  [IngestRequestField.Jobs]: Joi.array()
    .items(Joi.object().unknown(true))
    .max(MAX_JOBS_PER_INGEST_BATCH)
    .required(),
});
