import { RejectedJobRepository } from "../../domain/job/job.repository";
import { RejectedJob } from "../../domain/job/job.types";


export class InMemoryRejectedJobRepository
    implements RejectedJobRepository {

    private rejectedJobs: RejectedJob[] = [];


    async save(
        rejectedJob: RejectedJob,
    ): Promise<RejectedJob> {
        this.rejectedJobs.push(rejectedJob);

        return rejectedJob;
    }


    async getAll(): Promise<RejectedJob[]> {
        return [...this.rejectedJobs];
    }


    async getById(
        id: string,
    ): Promise<RejectedJob | null> {
        return this.rejectedJobs.find(
            rejectedJob => rejectedJob.job.id === id,
        ) ?? null;
    }
}