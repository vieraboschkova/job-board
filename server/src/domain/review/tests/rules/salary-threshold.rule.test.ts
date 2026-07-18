import { describe, expect, it } from "vitest";

import { SalaryUnit } from "../../../job/job.enums";
import { RejectionReason } from "../../review.enums";
import { salaryThresholdRule } from "../../rules/salary-threshold.rule";
import { createJob } from "../create-job";

describe("salaryThresholdRule", () => {
  it("approves annual salary above 100000 USD", () => {
    expect(salaryThresholdRule.evaluate(createJob())).toEqual([]);
  });

  it("approves annual salary just above threshold", () => {
    const reasons = salaryThresholdRule.evaluate(
      createJob({
        salary: { min: 100_001, currency: "USD", unit: SalaryUnit.Annual },
      }),
    );

    expect(reasons).toEqual([]);
  });

  it("approves annual salary with empty currency as USD", () => {
    const reasons = salaryThresholdRule.evaluate(
      createJob({
        salary: { min: 150_000, currency: "", unit: SalaryUnit.Annual },
      }),
    );

    expect(reasons).toEqual([]);
  });

  it("approves hourly salary above 45 USD", () => {
    const reasons = salaryThresholdRule.evaluate(
      createJob({
        salary: { min: 65, currency: "USD", unit: SalaryUnit.Hourly },
      }),
    );

    expect(reasons).toEqual([]);
  });

  it("approves hourly salary just above threshold", () => {
    const reasons = salaryThresholdRule.evaluate(
      createJob({
        salary: { min: 45.01, currency: "USD", unit: SalaryUnit.Hourly },
      }),
    );

    expect(reasons).toEqual([]);
  });

  it("rejects missing salary", () => {
    const reasons = salaryThresholdRule.evaluate(
      createJob({ salary: undefined }),
    );

    expect(reasons[0]?.reason).toBe(RejectionReason.InvalidSalary);
  });

  it("rejects salary with max only", () => {
    const reasons = salaryThresholdRule.evaluate(
      createJob({
        salary: { max: 150_000, currency: "USD", unit: SalaryUnit.Annual },
      }),
    );

    expect(reasons[0]?.reason).toBe(RejectionReason.InvalidSalary);
  });

  it("rejects annual salary at or below threshold", () => {
    const reasons = salaryThresholdRule.evaluate(
      createJob({
        salary: { min: 100_000, currency: "USD", unit: SalaryUnit.Annual },
      }),
    );

    expect(reasons[0]?.reason).toBe(RejectionReason.InvalidSalary);
  });

  it("rejects range when min is at or below threshold even if max is above", () => {
    const reasons = salaryThresholdRule.evaluate(
      createJob({
        salary: {
          min: 100_000,
          max: 140_000,
          currency: "USD",
          unit: SalaryUnit.Annual,
        },
      }),
    );

    expect(reasons[0]?.reason).toBe(RejectionReason.InvalidSalary);
  });

  it("rejects hourly salary at or below threshold", () => {
    const reasons = salaryThresholdRule.evaluate(
      createJob({
        salary: { min: 45, currency: "USD", unit: SalaryUnit.Hourly },
      }),
    );

    expect(reasons[0]?.reason).toBe(RejectionReason.InvalidSalary);
  });

  it("rejects non-USD currency", () => {
    const reasons = salaryThresholdRule.evaluate(
      createJob({
        salary: { min: 150_000, currency: "CAD", unit: SalaryUnit.Annual },
      }),
    );

    expect(reasons[0]?.reason).toBe(RejectionReason.InvalidSalary);
  });

  it("rejects monthly and unknown salary units", () => {
    for (const unit of [SalaryUnit.Monthly, SalaryUnit.Unknown]) {
      const reasons = salaryThresholdRule.evaluate(
        createJob({
          salary: { min: 200_000, currency: "USD", unit },
        }),
      );

      expect(reasons[0]?.reason).toBe(RejectionReason.InvalidSalary);
    }
  });
});
