import { Job, PublishedJob } from "../job/job.types";

export interface JobPublishingService {
  publish(job: Job): Promise<PublishedJob>;
}
