import { describe, expect, it } from "vitest";
import { SalaryUnit } from "../../../../domain/job/job.enums";
import { parseSalary } from "../parse-salary";

describe("parseSalary", () => {
  it("parses numeric salary as annual", () => {
    expect(parseSalary(150000)).toEqual({
      min: 150000,
      currency: "",
      unit: SalaryUnit.Annual,
    });
  });

  it("parses salary object with value", () => {
    expect(
      parseSalary({
        value: 145000,
        currency: "USD",
      }),
    ).toEqual({
      min: 145000,
      currency: "USD",
      unit: SalaryUnit.Annual,
    });
  });

  it("parses salary object with min and max", () => {
    expect(
      parseSalary({
        min: 100000,
        max: 140000,
        currency: "USD",
      }),
    ).toEqual({
      min: 100000,
      max: 140000,
      currency: "USD",
      unit: SalaryUnit.Annual,
    });
  });

  it("parses hourly salary object", () => {
    expect(
      parseSalary({
        value: 65,
        currency: "USD",
        unit: "hourly",
      }),
    ).toEqual({
      min: 65,
      currency: "USD",
      unit: SalaryUnit.Hourly,
    });
  });

  it("parses monthly salary object using period", () => {
    expect(
      parseSalary({
        min: 5000,
        max: 7000,
        currency: "EUR",
        period: "monthly",
      }),
    ).toEqual({
      min: 5000,
      max: 7000,
      currency: "EUR",
      unit: SalaryUnit.Monthly,
    });
  });

  it("parses annual period", () => {
    expect(
      parseSalary({
        value: 120000,
        currency: "USD",
        period: "annual",
      }),
    ).toEqual({
      min: 120000,
      currency: "USD",
      unit: SalaryUnit.Annual,
    });
  });

  it("trims currency whitespace", () => {
    expect(
      parseSalary({
        value: 100000,
        currency: " USD ",
      }),
    ).toEqual({
      min: 100000,
      currency: "USD",
      unit: SalaryUnit.Annual,
    });
  });

  it("parses dollar salary string", () => {
    expect(parseSalary("$120,000")).toEqual({
      min: 120000,
      currency: "USD",
      unit: SalaryUnit.Annual,
    });
  });

  it("parses hourly salary string", () => {
    expect(parseSalary("$50/hour")).toEqual({
      min: 50,
      currency: "USD",
      unit: SalaryUnit.Hourly,
    });
  });

  it("parses salary range with k suffix", () => {
    expect(parseSalary("100k-140k")).toEqual({
      min: 100000,
      max: 140000,
      currency: "",
      unit: SalaryUnit.Annual,
    });
  });

  it("parses salary range without k suffix", () => {
    expect(parseSalary("100000-140000")).toEqual({
      min: 100000,
      max: 140000,
      currency: "",
      unit: SalaryUnit.Annual,
    });
  });

  it("parses uppercase K suffix", () => {
    expect(parseSalary("100K-140K")).toEqual({
      min: 100000,
      max: 140000,
      currency: "",
      unit: SalaryUnit.Annual,
    });
  });

  it("handles whitespace around salary string", () => {
    expect(parseSalary("  $120,000  ")).toEqual({
      min: 120000,
      currency: "USD",
      unit: SalaryUnit.Annual,
    });
  });

  it("returns undefined for invalid salary string", () => {
    expect(parseSalary("not a salary")).toBeUndefined();
  });

  it("returns undefined for empty string", () => {
    expect(parseSalary("")).toBeUndefined();
  });

  it("returns undefined for null", () => {
    expect(parseSalary(null)).toBeUndefined();
  });

  it("returns undefined for undefined", () => {
    expect(parseSalary(undefined)).toBeUndefined();
  });

  it("returns undefined for array input", () => {
    expect(parseSalary([])).toBeUndefined();
  });

  it("returns undefined when salary object has no numeric value", () => {
    expect(
      parseSalary({
        currency: "USD",
      }),
    ).toBeUndefined();
  });

  it("defaults unknown object unit to annual", () => {
    expect(
      parseSalary({
        value: 100000,
        currency: "USD",
        unit: "something",
      }),
    ).toEqual({
      min: 100000,
      currency: "USD",
      unit: SalaryUnit.Annual,
    });
  });
});
