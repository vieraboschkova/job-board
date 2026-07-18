import { describe, expect, it } from "vitest";
import { formatSalary } from "../format-salary";

describe("formatSalary", () => {
  it("returns placeholder when salary is missing", () => {
    expect(formatSalary(undefined)).toBe("Salary not listed");
    expect(
      formatSalary({ currency: "USD", unit: "annual" }),
    ).toBe("Salary not listed");
  });

  it("formats a single annual amount", () => {
    expect(
      formatSalary({ min: 120000, currency: "USD", unit: "annual" }),
    ).toMatch(/120,000/);
    expect(
      formatSalary({ min: 120000, currency: "USD", unit: "annual" }),
    ).toContain("/yr");
  });

  it("formats hourly amounts with suffix", () => {
    expect(
      formatSalary({ min: 65, currency: "USD", unit: "hourly" }),
    ).toContain("/hr");
  });

  it("formats a range when min and max differ", () => {
    const formatted = formatSalary({
      min: 100000,
      max: 140000,
      currency: "USD",
      unit: "annual",
    });
    expect(formatted).toContain("–");
    expect(formatted).toMatch(/100,000/);
    expect(formatted).toMatch(/140,000/);
  });
});
