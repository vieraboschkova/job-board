import { describe, expect, it } from "vitest";

import { RejectionReason } from "../../../../domain/review/review.enums";
import { titleRequiredRule } from "../../rules/title-required.rule";
import { createJob } from "../create-job";

describe("titleRequiredRule", () => {
  it("approves a non-empty title", () => {
    expect(titleRequiredRule.evaluate(createJob())).toEqual([]);
  });

  it("rejects an empty title", () => {
    expect(titleRequiredRule.evaluate(createJob({ title: "" }))).toEqual([
      {
        reason: RejectionReason.MissingTitle,
        details: "Title is required",
      },
    ]);
  });

  it("rejects a whitespace-only title", () => {
    const reasons = titleRequiredRule.evaluate(createJob({ title: "   " }));

    expect(reasons[0]?.reason).toBe(RejectionReason.MissingTitle);
  });
});
