import { Job, PublishedJob } from "./job.types";

export interface JobPublisher {
  publish(job: Job): Promise<PublishedJob>;
}
