import { describe, expect, it } from "vitest";

import {
  CompanyType,
  CountryCode,
  EmploymentType,
  Language,
  SalaryUnit,
} from "../../../domain/job/job.enums";
import { RejectionReason } from "../../../domain/review/review.enums";
import { ReviewRule } from "../../../domain/review/review.types";
import { DefaultReviewEngine } from "../default-review-engine";
import { defaultRules } from "../rules";
import { createJob } from "./create-job";

describe("DefaultReviewEngine", () => {
  const engine = new DefaultReviewEngine();

  it("approves a valid job", () => {
    const decision = engine.review(createJob());

    expect(decision).toEqual({ approved: true, rejectionReasons: [] });
  });

  it("returns all rejection reasons for a multi-fail job", () => {
    const decision = engine.review(
      createJob({
        title: "",
        employmentType: EmploymentType.Contract,
        companyType: CompanyType.StaffingFirm,
        language: Language.German,
        location: { country: CountryCode.UK, remote: false },
        salary: { min: 40, currency: "USD", unit: SalaryUnit.Hourly },
      }),
    );

    expect(decision.approved).toBe(false);
    expect(decision.rejectionReasons.map((r) => r.reason)).toEqual([
      RejectionReason.MissingTitle,
      RejectionReason.InvalidLocation,
      RejectionReason.InvalidEmploymentType,
      RejectionReason.InvalidSalary,
      RejectionReason.InvalidCompanyType,
      RejectionReason.InvalidLanguage,
    ]);
  });

  it("approves when given an empty rule list", () => {
    const emptyEngine = new DefaultReviewEngine([]);

    const decision = emptyEngine.review(
      createJob({ title: "", companyType: CompanyType.StaffingFirm }),
    );

    expect(decision).toEqual({ approved: true, rejectionReasons: [] });
  });

  it("supports adding a custom rule without changing built-ins", () => {
    const customRule: ReviewRule = {
      name: "custom_company_name",
      evaluate(job) {
        if (job.company === "Blocked Co") {
          return [
            {
              reason: RejectionReason.Other,
              details: "Blocked company",
            },
          ];
        }

        return [];
      },
    };

    const customEngine = new DefaultReviewEngine([...defaultRules, customRule]);

    expect(customEngine.review(createJob()).approved).toBe(true);
    expect(
      customEngine.review(createJob({ company: "Blocked Co" }))
        .rejectionReasons,
    ).toEqual([
      {
        reason: RejectionReason.Other,
        details: "Blocked company",
      },
    ]);
    expect(engine.review(createJob({ company: "Blocked Co" })).approved).toBe(
      true,
    );
  });
});
