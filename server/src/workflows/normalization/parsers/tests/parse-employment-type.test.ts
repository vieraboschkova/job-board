import { describe, expect, it } from "vitest";
import { EmploymentType } from "../../../../domain/job/job.enums";
import { parseEmploymentType } from "../parse-employment-type";

describe("parseEmploymentType", () => {
  it("parses full time", () => {
    expect(parseEmploymentType("Full-Time")).toBe(EmploymentType.FullTime);
  });

  it("parses full time without dash", () => {
    expect(parseEmploymentType("Full Time")).toBe(EmploymentType.FullTime);
  });

  it("parses part time", () => {
    expect(parseEmploymentType("Part-Time")).toBe(EmploymentType.PartTime);
  });

  it("parses contract", () => {
    expect(parseEmploymentType("Contract")).toBe(EmploymentType.Contract);
  });

  it("parses internship", () => {
    expect(parseEmploymentType("Internship")).toBe(EmploymentType.Internship);
  });

  it("trims whitespace", () => {
    expect(parseEmploymentType("  Full-Time ")).toBe(EmploymentType.FullTime);
  });

  it("returns unknown for unsupported value", () => {
    expect(parseEmploymentType("Temporary")).toBe(EmploymentType.Unknown);
  });

  it("returns unknown for empty value", () => {
    expect(parseEmploymentType("")).toBe(EmploymentType.Unknown);
  });
});
