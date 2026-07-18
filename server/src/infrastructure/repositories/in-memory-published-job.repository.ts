import { PublishedJobRepository } from "../../domain/job/job.repository";
import { PublishedJob } from "../../domain/job/job.types";

export class InMemoryPublishedJobRepository implements PublishedJobRepository {
  private publishedJobs: PublishedJob[] = [];
  private bySourceKey = new Map<string, PublishedJob>();

  async save(publishedJob: PublishedJob): Promise<PublishedJob> {
    this.publishedJobs.push(publishedJob);
    this.indexBySource(publishedJob);
    return publishedJob;
  }

  async getAll(): Promise<PublishedJob[]> {
    return [...this.publishedJobs];
  }

  async getById(id: string): Promise<PublishedJob | null> {
    return (
      this.publishedJobs.find((publishedJob) => publishedJob.job.id === id) ??
      null
    );
  }

  async findBySource(
    sourceName: string,
    sourceId: string,
  ): Promise<PublishedJob | null> {
    return this.bySourceKey.get(toSourceKey(sourceName, sourceId)) ?? null;
  }

  private indexBySource(publishedJob: PublishedJob): void {
    const { sourceName, sourceId } = publishedJob.job;
    if (!sourceId) {
      return;
    }
    this.bySourceKey.set(toSourceKey(sourceName, sourceId), publishedJob);
  }
}

function toSourceKey(sourceName: string, sourceId: string): string {
  return `${sourceName}:${sourceId}`;
}
