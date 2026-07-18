import { RejectedJobRepository } from "../../domain/job/job.repository";
import {
  RejectedJobsReader,
  RejectionSummary,
} from "../../domain/job/job.types";
import { toRejectionSummary } from "./to-rejection-summary";

export class RejectedJobsReaderService implements RejectedJobsReader {
  constructor(private readonly rejectedJobRepository: RejectedJobRepository) {}

  async getAll(): Promise<RejectionSummary[]> {
    const rejectedJobs = await this.rejectedJobRepository.getAll();
    return rejectedJobs.map(toRejectionSummary);
  }
}
