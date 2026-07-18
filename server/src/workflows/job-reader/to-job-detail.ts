import { Job, JobDetail } from "../../domain/job/job.types";

/** Public job detail: full job fields except raw ingestion payload. */
export function toJobDetail(job: Job): JobDetail {
  const { rawData: _rawData, ...detail } = job;
  return detail;
}
