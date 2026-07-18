import { CountryCode, JobSort } from "../../domain/job/job.enums";
import {
  JobSearchRepository,
  PublishedJobRepository,
} from "../../domain/job/job.repository";
import {
  JobDetail,
  JobSearchQuery,
  JobSearchQueryInput,
  PublishedJobsReader,
  JobSummary,
} from "../../domain/job/job.types";
import { toJobDetail } from "./to-job-detail";

export class PublishedJobsReaderService implements PublishedJobsReader {
  constructor(
    private readonly publishedJobRepository: PublishedJobRepository,
    private readonly jobSearchRepository: JobSearchRepository,
  ) {}

  async getAll(): Promise<JobDetail[]> {
    const publishedJobs = await this.publishedJobRepository.getAll();
    return publishedJobs.map((published) => toJobDetail(published.job));
  }

  async search(query: JobSearchQueryInput): Promise<JobSummary[]> {
    const normalized = this.normalizeSearchQuery(query);
    return this.jobSearchRepository.search(normalized);
  }

  async getById(id: string): Promise<JobDetail | null> {
    const published = await this.publishedJobRepository.getById(id);
    return published ? toJobDetail(published.job) : null;
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
