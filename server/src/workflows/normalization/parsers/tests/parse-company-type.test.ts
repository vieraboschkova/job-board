import { describe, expect, it } from "vitest";

import { CompanyType } from "../../../../domain/job/job.enums";
import { parseCompanyType } from "../parse-company-type";

describe("parseCompanyType", () => {
  it("parses direct employer", () => {
    expect(parseCompanyType("Direct Employer")).toBe(
      CompanyType.DirectEmployer,
    );
  });

  it("parses staffing firm", () => {
    expect(parseCompanyType("Staffing Firm")).toBe(CompanyType.StaffingFirm);
  });

  it("parses consulting agency", () => {
    expect(parseCompanyType("Consulting Agency")).toBe(
      CompanyType.ConsultingAgency,
    );
  });

  it("trims and lowercases input", () => {
    expect(parseCompanyType("  STAFFING FIRM ")).toBe(CompanyType.StaffingFirm);
  });

  it("returns unknown for blank values", () => {
    expect(parseCompanyType("")).toBe(CompanyType.Unknown);
    expect(parseCompanyType("  ")).toBe(CompanyType.Unknown);
  });

  it("returns unknown for unrecognized values", () => {
    expect(parseCompanyType("Freelancer")).toBe(CompanyType.Unknown);
  });
});
