import { DefaultJobNormalizer } from "../../../workflows/normalization/default-job-normalizer";
import exampleJobs from "../../../tests/mock/exampleJobs.json";
import { Job } from "../../job/job.types";

const baseJob: Job = {
  ...new DefaultJobNormalizer().normalize(
    exampleJobs[0] as Record<string, unknown>,
    "test",
  ),
  id: "job-1",
  createdAt: new Date("2023-10-03"),
};

export function createJob(overrides: Partial<Job> = {}): Job {
  const { location, salary, ...rest } = overrides;
  const job = structuredClone(baseJob);

  return {
    ...job,
    location: {
      ...job.location,
      ...location,
    },
    salary: "salary" in overrides ? salary : job.salary,
    ...rest,
  };
}
