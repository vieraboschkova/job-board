import { describe, expect, it } from "vitest";

import {
  CompanyType,
  EmploymentType,
  Language,
  SalaryUnit,
} from "../../../../domain/job/job.enums";
import {
  extractCompanyType,
  extractEmploymentType,
  extractLanguage,
  extractPostedAt,
  extractSalary,
  extractSourceId,
} from "../extract-fields";

describe("extractSourceId", () => {
  it("extracts sourceId", () => {
    expect(extractSourceId({ sourceId: "src-1" })).toBe("src-1");
  });

  it("falls back to id", () => {
    expect(extractSourceId({ id: "job-42" })).toBe("job-42");
  });

  it("falls back to jobId as string", () => {
    expect(extractSourceId({ jobId: 99 })).toBe("99");
  });

  it("prefers sourceId over id", () => {
    expect(
      extractSourceId({
        sourceId: "preferred",
        id: "ignored",
      }),
    ).toBe("preferred");
  });

  it("returns undefined when missing", () => {
    expect(extractSourceId({})).toBeUndefined();
  });
});

describe("extractEmploymentType", () => {
  it("extracts employment_type", () => {
    expect(
      extractEmploymentType({
        employment_type: "Full-Time",
      }),
    ).toBe(EmploymentType.FullTime);
  });

  it("falls back to employmentType", () => {
    expect(
      extractEmploymentType({
        employmentType: "Contract",
      }),
    ).toBe(EmploymentType.Contract);
  });

  it("skips blank employment_type and uses alias", () => {
    expect(
      extractEmploymentType({
        employment_type: "",
        employmentType: "Full-Time",
      }),
    ).toBe(EmploymentType.FullTime);
  });

  it("returns unknown when missing", () => {
    expect(extractEmploymentType({})).toBe(EmploymentType.Unknown);
  });
});

describe("extractCompanyType", () => {
  it("extracts company_type", () => {
    expect(
      extractCompanyType({
        company_type: "Direct Employer",
      }),
    ).toBe(CompanyType.DirectEmployer);
  });

  it("falls back to companyType", () => {
    expect(
      extractCompanyType({
        companyType: "Staffing Firm",
      }),
    ).toBe(CompanyType.StaffingFirm);
  });

  it("returns unknown when missing", () => {
    expect(extractCompanyType({})).toBe(CompanyType.Unknown);
  });
});

describe("extractSalary", () => {
  it("extracts salary object", () => {
    expect(
      extractSalary({
        salary: {
          value: 120000,
          currency: "USD",
        },
      }),
    ).toEqual({
      min: 120000,
      currency: "USD",
      unit: SalaryUnit.Annual,
    });
  });

  it("falls back to compensation", () => {
    expect(
      extractSalary({
        compensation: 65,
      }),
    ).toEqual({
      min: 65,
      currency: "",
      unit: SalaryUnit.Annual,
    });
  });

  it("skips blank salary and uses compensation", () => {
    expect(
      extractSalary({
        salary: "",
        compensation: {
          value: 130000,
          currency: "USD",
        },
      }),
    ).toEqual({
      min: 130000,
      currency: "USD",
      unit: SalaryUnit.Annual,
    });
  });

  it("returns undefined when missing", () => {
    expect(extractSalary({})).toBeUndefined();
  });
});

describe("extractPostedAt", () => {
  it("extracts posting_date", () => {
    expect(
      extractPostedAt({
        posting_date: "2023-10-03",
      }),
    ).toEqual(new Date("2023-10-03"));
  });

  it("falls back to posted_date", () => {
    expect(
      extractPostedAt({
        posted_date: "2023-11-01",
      }),
    ).toEqual(new Date("2023-11-01"));
  });

  it("skips blank posting_date and uses alias", () => {
    expect(
      extractPostedAt({
        posting_date: "",
        posted_date: "2023-11-01",
      }),
    ).toEqual(new Date("2023-11-01"));
  });

  it("returns undefined for blank date", () => {
    expect(extractPostedAt({ posting_date: "" })).toBeUndefined();
  });
});

describe("extractLanguage", () => {
  it("extracts provided language", () => {
    expect(
      extractLanguage(
        {
          language: "French",
        },
        "fallback text",
      ),
    ).toBe(Language.French);
  });

  it("falls back to description text when language is blank", () => {
    expect(
      extractLanguage(
        {
          language: "",
        },
        "An excellent opportunity for a Junior Developer.",
      ),
    ).toBe(Language.English);
  });

  it("returns unknown when language and fallback are missing", () => {
    expect(extractLanguage({}, "")).toBe(Language.Unknown);
  });
});
