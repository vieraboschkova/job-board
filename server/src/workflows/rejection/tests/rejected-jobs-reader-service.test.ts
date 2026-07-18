import { beforeEach, describe, expect, it } from "vitest";

import {
  CompanyType,
  CountryCode,
  EmploymentType,
  Language,
  SalaryUnit,
} from "../../../domain/job/job.enums";
import { RejectionReason } from "../../../domain/review/review.enums";
import { InMemoryRejectedJobRepository } from "../../../infrastructure/repositories/in-memory-rejected-job.repository";
import { createJob } from "../../review/tests/create-job";
import { RejectedJobsReaderService } from "../rejected-jobs-reader-service";
import { toRejectionSummary } from "../to-rejection-summary";

describe("toRejectionSummary", () => {
  it("maps rejected job fields used by review rules and omits rawData", () => {
    const job = createJob({
      id: "rej-1",
      title: "Backend Engineer",
      company: "Acme Staffing",
      companyType: CompanyType.StaffingFirm,
      language: Language.Spanish,
      location: {
        country: CountryCode.Other,
        city: "Mexico City",
        remote: false,
      },
      employmentType: EmploymentType.Contract,
      salary: {
        min: 40000,
        currency: "USD",
        unit: SalaryUnit.Annual,
      },
      sourceName: "demo-feed",
    });
    const rejectedAt = new Date("2023-10-20T12:00:00.000Z");
    const rejectionReasons = [
      { reason: RejectionReason.InvalidCompanyType, details: "staffing firm" },
      { reason: RejectionReason.InvalidLanguage },
    ];

    const summary = toRejectionSummary({
      job,
      rejectedAt,
      rejectionReasons,
    });

    expect(summary).toEqual({
      id: "rej-1",
      sourceName: "demo-feed",
      rejectedAt,
      rejectionReasons,
      job: {
        title: "Backend Engineer",
        language: Language.Spanish,
        location: {
          country: CountryCode.Other,
          city: "Mexico City",
          remote: false,
        },
        employmentType: EmploymentType.Contract,
        salary: {
          min: 40000,
          currency: "USD",
          unit: SalaryUnit.Annual,
        },
        companyType: CompanyType.StaffingFirm,
        company: "Acme Staffing",
      },
    });
    expect(summary.job).not.toHaveProperty("rawData");
    expect(summary.job).not.toHaveProperty("description");
  });

  it("omits salary when the job has none", () => {
    const job = createJob({ salary: undefined });
    const summary = toRejectionSummary({
      job,
      rejectedAt: new Date(),
      rejectionReasons: [{ reason: RejectionReason.InvalidSalary }],
    });

    expect(summary.job).not.toHaveProperty("salary");
  });
});

describe("RejectedJobsReaderService", () => {
  let repository: InMemoryRejectedJobRepository;
  let service: RejectedJobsReaderService;

  beforeEach(() => {
    repository = new InMemoryRejectedJobRepository();
    service = new RejectedJobsReaderService(repository);
  });

  it("returns an empty array when nothing is rejected", async () => {
    await expect(service.getAll()).resolves.toEqual([]);
  });

  it("lists rejection summaries for stored rejected jobs", async () => {
    const job = createJob({ id: "stored-1", title: "Rejected Role" });
    const rejected = await repository.save({
      job,
      rejectedAt: new Date("2023-11-01T00:00:00.000Z"),
      rejectionReasons: [{ reason: RejectionReason.MissingTitle }],
    });

    const result = await service.getAll();

    expect(result).toEqual([toRejectionSummary(rejected)]);
  });
});
