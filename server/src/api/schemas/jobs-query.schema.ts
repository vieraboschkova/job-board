import Joi from "joi";

export interface JobsQuery {
  search?: string;
  country?: string;
  sort?: string;
}

/** Permissive query schema — enum validation happens in JobReaderService. */
export const jobsQuerySchema = Joi.object<JobsQuery>({
  search: Joi.string().optional().allow(""),
  country: Joi.string().optional().allow(""),
  sort: Joi.string().optional().allow(""),
});
