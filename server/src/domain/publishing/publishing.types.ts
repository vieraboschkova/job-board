import { Job } from "../job/job.types";
import { PublishOutcome } from "../job/publishing.types";

export interface JobPublishingService {
  publish(job: Job): Promise<PublishOutcome>;
}
