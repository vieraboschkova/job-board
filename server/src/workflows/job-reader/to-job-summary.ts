import { Job, JobSummary } from "../../domain/job/job.types";

export function toJobSummary(job: Job): JobSummary {
  const summary: JobSummary = {
    id: job.id,
    title: job.title,
    company: job.company,
    location: job.location,
    employmentType: job.employmentType,
  };

  if (job.salary !== undefined) {
    summary.salary = job.salary;
  }

  if (job.postedAt !== undefined) {
    summary.postedAt = job.postedAt;
  }

  return summary;
}
