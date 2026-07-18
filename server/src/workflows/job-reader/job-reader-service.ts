import { CountryCode, JobSort } from "../../domain/job/job.enums";
import { PublishedJobRepository } from "../../domain/job/job.repository";
import {
  Job,
  JobSearchQuery,
  JobSearchQueryInput,
  JobReader,
} from "../../domain/job/job.types";

export class JobReaderService implements JobReader {
  constructor(
    private readonly publishedJobRepository: PublishedJobRepository,
  ) {}

  async getAll(): Promise<Job[]> {
    const publishedJobs = await this.publishedJobRepository.getAll();
    return publishedJobs.map((published) => published.job);
  }

  async search(query: JobSearchQueryInput): Promise<Job[]> {
    const normalized = this.normalizeSearchQuery(query);
    const publishedJobs = await this.publishedJobRepository.search(normalized);
    return publishedJobs.map((published) => published.job);
  }

  async getById(id: string): Promise<Job | null> {
    const published = await this.publishedJobRepository.getById(id);
    return published?.job ?? null;
  }

  private normalizeSearchQuery(query: JobSearchQueryInput): JobSearchQuery {
    const normalized: JobSearchQuery = {};

    const search = query.search?.trim();
    if (search) {
      normalized.search = search;
    }

    if (this.isCountryCode(query.country)) {
      normalized.country = query.country;
    }

    if (this.isJobSort(query.sort)) {
      normalized.sort = query.sort;
    }

    return normalized;
  }

  private isCountryCode(value: string | undefined): value is CountryCode {
    return (
      value !== undefined &&
      (Object.values(CountryCode) as string[]).includes(value)
    );
  }

  private isJobSort(value: string | undefined): value is JobSort {
    return (
      value !== undefined &&
      (Object.values(JobSort) as string[]).includes(value)
    );
  }
}
