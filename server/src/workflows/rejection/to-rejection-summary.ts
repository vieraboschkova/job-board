import { RejectedJob, RejectionSummary } from "../../domain/job/job.types";

export function toRejectionSummary(rejected: RejectedJob): RejectionSummary {
  const { job } = rejected;
  const summary: RejectionSummary = {
    id: job.id,
    sourceName: job.sourceName,
    rejectedAt: rejected.rejectedAt,
    rejectionReasons: rejected.rejectionReasons,
    job: {
      title: job.title,
      language: job.language,
      location: job.location,
      employmentType: job.employmentType,
      companyType: job.companyType,
      company: job.company,
    },
  };

  if (job.salary !== undefined) {
    summary.job.salary = job.salary;
  }

  return summary;
}
