import { Job, PublishedJob } from "./job.types";

export type PublishOutcome =
  | { status: "created"; publishedJob: PublishedJob }
  | { status: "duplicate"; publishedJob: PublishedJob };

export interface JobPublisher {
  publish(job: Job): Promise<PublishOutcome>;
}
