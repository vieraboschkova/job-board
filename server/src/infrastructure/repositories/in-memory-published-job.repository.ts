import { PublishedJobRepository } from "../../domain/job/job.repository";
import { PublishedJob, JobSearchQuery } from "../../domain/job/job.types";
import { JobSort } from "../../domain/job/job.enums";

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

  async search(query: JobSearchQuery): Promise<PublishedJob[]> {
    let result = [...this.publishedJobs];

    if (query.search) {
      const searchTerm = query.search.toLowerCase();

      result = result.filter(
        (publishedJob) =>
          publishedJob.job.title.toLowerCase().includes(searchTerm) ||
          publishedJob.job.company.toLowerCase().includes(searchTerm),
      );
    }

    if (query.country) {
      result = result.filter(
        (publishedJob) => publishedJob.job.location.country === query.country,
      );
    }

    if (query.sort) {
      result = this.sort(result, query.sort);
    }

    // TODO: improve offset and limit implementation
    const offset = query.offset ?? 0;

    if (query.limit !== undefined) {
      result = result.slice(offset, offset + query.limit);
    } else {
      result = result.slice(offset);
    }

    return result;
  }

  private indexBySource(publishedJob: PublishedJob): void {
    const { sourceName, sourceId } = publishedJob.job;
    if (!sourceId) {
      return;
    }
    this.bySourceKey.set(toSourceKey(sourceName, sourceId), publishedJob);
  }

  private sort(publishedJobs: PublishedJob[], sort: JobSort): PublishedJob[] {
    return [...publishedJobs].sort((a, b) => {
      switch (sort) {
        case JobSort.SalaryAscending:
          return this.getSalary(a) - this.getSalary(b);

        case JobSort.SalaryDescending:
          return this.getSalary(b) - this.getSalary(a);

        case JobSort.PostedAtAscending:
          return this.getDate(a) - this.getDate(b);

        case JobSort.PostedAtDescending:
          return this.getDate(b) - this.getDate(a);

        default:
          return 0;
      }
    });
  }

  // TODO: define if monthly salaries, how to process for common denominator

  // TODO: define date format
  private getSalary(publishedJob: PublishedJob): number {
    return publishedJob.job.salary?.min ?? 0;
  }

  private getDate(publishedJob: PublishedJob): number {
    return publishedJob.job.postedAt?.getTime() ?? 0;
  }
}

function toSourceKey(sourceName: string, sourceId: string): string {
  return `${sourceName}:${sourceId}`;
}
