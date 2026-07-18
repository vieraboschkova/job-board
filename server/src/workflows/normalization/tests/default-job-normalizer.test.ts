import { describe, expect, it } from "vitest";

import {
  CompanyType,
  CountryCode,
  EmploymentType,
  Language,
  SalaryUnit,
} from "../../../domain/job/job.enums";
import { RawJobPosting } from "../../../domain/ingestion/ingestion.types";
import { DefaultJobNormalizer } from "../default-job-normalizer";
import exampleJobs from "../../../tests/mock/exampleJobs.json";

describe("DefaultJobNormalizer", () => {
  const normalizer = new DefaultJobNormalizer();

  it("normalizes a canonical object-shaped job", () => {
    const rawJob = exampleJobs[0] as Record<string, unknown>;

    const job = normalizer.normalize(rawJob, "example-feed");

    expect(job.createdAt).toBeInstanceOf(Date);
    expect(job).toMatchObject({
      title: "Backend Engineer",
      company: "NextGen Systems",
      description:
        "Join our backend team to build scalable APIs using Go and microservices architecture.",
      language: Language.English,
      location: {
        city: "Austin",
        country: CountryCode.US,
        remote: false,
      },
      salary: {
        min: 145000,
        currency: "USD",
        unit: SalaryUnit.Annual,
      },
      employmentType: EmploymentType.FullTime,
      companyType: CompanyType.DirectEmployer,
      sourceName: "example-feed",
      rawData: rawJob,
      postedAt: new Date("2023-10-03"),
    });
  });

  it("preserves source id and always generates a local id", () => {
    const rawJob = {
      id: "source-42",
      title: "Backend Engineer",
      company: "NextGen Systems",
      description: "Build APIs.",
      employment_type: "Full-Time",
      language: "English",
      location: "Austin, TX, USA",
    };

    const job = normalizer.normalize(rawJob, "example-feed");

    expect(job.id).not.toBe("source-42");
    expect(job.sourceId).toBe("source-42");
  });

  it("preserves numeric source id as string", () => {
    const job = normalizer.normalize(
      {
        jobId: 99,
        title: "Backend Engineer",
        company: "NextGen Systems",
        description: "Build APIs.",
      },
      "example-feed",
    );

    expect(job.sourceId).toBe("99");
  });

  it("omits sourceId when no source identifier exists", () => {
    const job = normalizer.normalize(
      {
        title: "Backend Engineer",
        company: "NextGen Systems",
        description: "Build APIs.",
      },
      "example-feed",
    );

    expect(job.sourceId).toBeUndefined();
  });

  it("normalizes alias fields and nested employer", () => {
    const rawJob = {
      jobTitle: "Platform Engineer",
      summary: "Improve reliability across services.",
      employer: {
        name: "Nested Labs",
      },
      employmentType: "Full-Time",
      posted_date: "2023-11-01",
      compensation: {
        value: 130000,
        currency: "USD",
      },
      location: "Boston, MA, USA",
      language: "English",
      remote: false,
    };

    const job = normalizer.normalize(rawJob, "alias-feed");

    expect(job.title).toBe("Platform Engineer");
    expect(job.company).toBe("Nested Labs");
    expect(job.description).toBe("Improve reliability across services.");
    expect(job.employmentType).toBe(EmploymentType.FullTime);
    expect(job.postedAt).toEqual(new Date("2023-11-01"));
    expect(job.salary).toEqual({
      min: 130000,
      currency: "USD",
      unit: SalaryUnit.Annual,
    });
    expect(job.location).toEqual({
      city: "Boston",
      country: CountryCode.US,
      remote: false,
    });
    expect(job.rawData).toEqual(rawJob);
  });

  it("normalizes Canada internship with CAD salary", () => {
    const rawJob = exampleJobs[1] as Record<string, unknown>;

    const job = normalizer.normalize(rawJob, "example-feed");

    expect(job).toMatchObject({
      title: "Frontend Developer Intern",
      company: "BrightStart Talent",
      language: Language.English,
      employmentType: EmploymentType.Internship,
      companyType: CompanyType.StaffingFirm,
      location: {
        city: "Vancouver",
        country: CountryCode.CA,
        remote: false,
      },
      salary: {
        min: 20000,
        currency: "CAD",
        unit: SalaryUnit.Annual,
      },
      postedAt: new Date("2023-10-06"),
    });
  });

  it("falls back across blank primary fields to aliases", () => {
    const job = normalizer.normalize(
      {
        title: "",
        jobTitle: "Platform Engineer",
        company: "  ",
        companyName: "Alias Labs",
        description: "",
        summary: "Improve reliability.",
        employment_type: "",
        employmentType: "Full-Time",
        posting_date: "",
        posted_date: "2023-11-01",
        salary: "",
        compensation: {
          value: 130000,
          currency: "USD",
        },
        company_type: "",
        companyType: "Consulting Agency",
        language: "English",
        location: "Boston, MA, USA",
      },
      "alias-feed",
    );

    expect(job.title).toBe("Platform Engineer");
    expect(job.company).toBe("Alias Labs");
    expect(job.description).toBe("Improve reliability.");
    expect(job.employmentType).toBe(EmploymentType.FullTime);
    expect(job.companyType).toBe(CompanyType.ConsultingAgency);
    expect(job.postedAt).toEqual(new Date("2023-11-01"));
    expect(job.salary).toEqual({
      min: 130000,
      currency: "USD",
      unit: SalaryUnit.Annual,
    });
  });

  it("normalizes French language and Canada location", () => {
    const rawJob = exampleJobs[2] as Record<string, unknown>;

    const job = normalizer.normalize(rawJob, "example-feed");

    expect(job.language).toBe(Language.French);
    expect(job.location).toEqual({
      city: "Montreal",
      country: CountryCode.CA,
      remote: false,
    });
  });

  it("normalizes hourly contract salary object", () => {
    const rawJob = exampleJobs[4] as Record<string, unknown>;

    const job = normalizer.normalize(rawJob, "example-feed");

    expect(job.employmentType).toBe(EmploymentType.Contract);
    expect(job.location).toEqual({
      city: "Seattle",
      country: CountryCode.US,
      remote: true,
    });
    expect(job.salary).toEqual({
      min: 65,
      currency: "USD",
      unit: SalaryUnit.Hourly,
    });
  });

  it("normalizes string location and numeric salary", () => {
    const rawJob = exampleJobs[5] as Record<string, unknown>;

    const job = normalizer.normalize(rawJob, "example-feed");

    expect(job.title).toBe("Senior Software Engineer");
    expect(job.location).toEqual({
      city: "New York",
      country: CountryCode.US,
      remote: false,
    });
    expect(job.salary).toEqual({
      min: 150000,
      currency: "",
      unit: SalaryUnit.Annual,
    });
  });

  it("normalizes decimal numeric salary and French language", () => {
    const rawJob = exampleJobs[7] as Record<string, unknown>;

    const job = normalizer.normalize(rawJob, "example-feed");

    expect(job.language).toBe(Language.French);
    expect(job.location).toEqual({
      city: "Montreal",
      country: CountryCode.CA,
      remote: false,
    });
    expect(job.salary).toEqual({
      min: 62.5,
      currency: "",
      unit: SalaryUnit.Annual,
    });
  });

  it("normalizes Remote location, part-time, and remote flag", () => {
    const remoteStringJob = exampleJobs[13] as Record<string, unknown>;
    const remoteFlagJob = exampleJobs[9] as Record<string, unknown>;

    const remoteStringNormalized = normalizer.normalize(
      remoteStringJob,
      "example-feed",
    );

    expect(remoteStringNormalized.location).toEqual({
      country: CountryCode.Other,
      remote: true,
    });
    expect(remoteStringNormalized.employmentType).toBe(EmploymentType.PartTime);

    expect(
      normalizer.normalize(remoteFlagJob, "example-feed").location,
    ).toEqual({
      city: "Chicago",
      country: CountryCode.US,
      remote: true,
    });
  });

  it("omits blank city from object location", () => {
    const rawJob = exampleJobs[10] as Record<string, unknown>;

    const job = normalizer.normalize(rawJob, "example-feed");

    expect(job.location).toEqual({
      country: CountryCode.US,
      remote: false,
    });
  });

  it("handles blank title and null location", () => {
    const rawJob = exampleJobs[19] as Record<string, unknown>;

    const job = normalizer.normalize(rawJob, "example-feed");

    expect(job.title).toBe("");
    expect(job.location).toEqual({
      country: CountryCode.Other,
      remote: true,
    });
    expect(job.employmentType).toBe(EmploymentType.Contract);
    expect(job.companyType).toBe(CompanyType.StaffingFirm);
    expect(job.salary).toEqual({
      min: 40,
      currency: "USD",
      unit: SalaryUnit.Hourly,
    });
    expect(job.rawData).toEqual(rawJob);
  });

  it("normalizes blank language and blank posting date", () => {
    const blankLanguageJob = exampleJobs[6] as Record<string, unknown>;
    const blankDateJob = exampleJobs[15] as Record<string, unknown>;

    expect(
      normalizer.normalize(blankLanguageJob, "example-feed").language,
    ).toBe(Language.English);
    expect(
      normalizer.normalize(blankDateJob, "example-feed").postedAt,
    ).toBeUndefined();
  });

  it("normalizes UK, Germany, and Ireland countries", () => {
    const ukJob = exampleJobs[3] as Record<string, unknown>;
    const germanyJob = exampleJobs[12] as Record<string, unknown>;
    const irelandJob = exampleJobs[16] as Record<string, unknown>;

    const ukNormalized = normalizer.normalize(ukJob, "example-feed");
    const germanyNormalized = normalizer.normalize(germanyJob, "example-feed");
    const irelandNormalized = normalizer.normalize(irelandJob, "example-feed");

    expect(ukNormalized.location).toEqual({
      city: "Manchester",
      country: CountryCode.UK,
      remote: true,
    });
    expect(germanyNormalized.location.country).toBe(CountryCode.Other);
    expect(germanyNormalized.language).toBe(Language.German);
    expect(irelandNormalized.location).toEqual({
      city: "Dublin",
      country: CountryCode.Other,
      remote: true,
    });
    expect(irelandNormalized.salary).toEqual({
      min: 58,
      currency: "EUR",
      unit: SalaryUnit.Hourly,
    });
  });

  it("uses unknown employment type when missing", () => {
    const job = normalizer.normalize(
      {
        title: "Mystery Role",
        company: "Unknown Co",
        description: "Something interesting.",
      },
      "sparse-feed",
    );

    expect(job.employmentType).toBe(EmploymentType.Unknown);
    expect(job.companyType).toBe(CompanyType.Unknown);
    expect(job.salary).toBeUndefined();
    expect(job.location).toEqual({
      country: CountryCode.Other,
      remote: false,
    });
  });

  it("does not crash on malformed non-record inputs", () => {
    const malformedInputs = [null, [], "not-an-object", 42] as RawJobPosting[];

    for (const rawJob of malformedInputs) {
      expect(() => normalizer.normalize(rawJob, "bad-feed")).not.toThrow();

      const job = normalizer.normalize(rawJob, "bad-feed");

      expect(job.title).toBe("");
      expect(job.company).toBe("");
      expect(job.description).toBe("");
      expect(job.employmentType).toBe(EmploymentType.Unknown);
      expect(job.companyType).toBe(CompanyType.Unknown);
      expect(job.location).toEqual({
        country: CountryCode.Other,
        remote: false,
      });
      expect(job.rawData).toEqual({});
      expect(job.sourceName).toBe("bad-feed");
    }
  });

  it("preserves raw payload exactly and does not mutate input", () => {
    const rawJob = {
      title: "QA Engineer",
      company: "QualityLoop",
      description: "Build automated test suites.",
      nested: {
        value: 1,
      },
    };

    const job = normalizer.normalize(rawJob, "example-feed");

    expect(job.rawData).toEqual(rawJob);
    expect(job.rawData).not.toBe(rawJob);
    expect(job.rawData.nested).not.toBe(rawJob.nested);

    rawJob.title = "Changed";
    rawJob.nested.value = 99;
    expect(job.rawData.title).toBe("QA Engineer");
    expect(job.rawData.nested).toEqual({ value: 1 });
  });
});
