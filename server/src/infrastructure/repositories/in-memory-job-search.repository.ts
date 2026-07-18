import { JobSearchRepository } from "../../domain/job/job.repository";
import { JobSearchQuery, JobSummary } from "../../domain/job/job.types";
import { JobSort } from "../../domain/job/job.enums";

export class InMemoryJobSearchRepository implements JobSearchRepository {
  private byId = new Map<string, JobSummary>();

  async save(summary: JobSummary): Promise<JobSummary> {
    this.byId.set(summary.id, summary);
    return summary;
  }

  async search(query: JobSearchQuery): Promise<JobSummary[]> {
    let result = [...this.byId.values()];

    if (query.search) {
      const searchTerm = query.search.toLowerCase();

      result = result.filter(
        (summary) =>
          summary.title.toLowerCase().includes(searchTerm) ||
          summary.company.toLowerCase().includes(searchTerm),
      );
    }

    if (query.country) {
      result = result.filter(
        (summary) => summary.location.country === query.country,
      );
    }

    if (query.sort) {
      result = this.sort(result, query.sort);
    }

    const offset = query.offset ?? 0;

    if (query.limit !== undefined) {
      result = result.slice(offset, offset + query.limit);
    } else {
      result = result.slice(offset);
    }

    return result;
  }

  private sort(summaries: JobSummary[], sort: JobSort): JobSummary[] {
    return [...summaries].sort((a, b) => {
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

  private getSalary(summary: JobSummary): number {
    return summary.salary?.min ?? 0;
  }

  private getDate(summary: JobSummary): number {
    return summary.postedAt?.getTime() ?? 0;
  }
}
