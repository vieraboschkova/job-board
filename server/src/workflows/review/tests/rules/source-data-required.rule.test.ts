import { describe, expect, it } from "vitest";

import { RejectionReason } from "../../../../domain/review/review.enums";
import { sourceDataRequiredRule } from "../../rules/source-data-required.rule";
import { createJob } from "../create-job";

describe("sourceDataRequiredRule", () => {
  it("approves when sourceName and sourceId are present", () => {
    expect(
      sourceDataRequiredRule.evaluate(
        createJob({ sourceName: "feed-a", sourceId: "ext-1" }),
      ),
    ).toEqual([]);
  });

  it("rejects when sourceId is missing", () => {
    expect(
      sourceDataRequiredRule.evaluate(createJob({ sourceId: undefined })),
    ).toEqual([
      {
        reason: RejectionReason.MissingSourceData,
        details: "sourceName and sourceId are required",
      },
    ]);
  });

  it("rejects when sourceId is whitespace", () => {
    const reasons = sourceDataRequiredRule.evaluate(
      createJob({ sourceId: "   " }),
    );

    expect(reasons[0]?.reason).toBe(RejectionReason.MissingSourceData);
  });

  it("rejects when sourceName is empty", () => {
    const reasons = sourceDataRequiredRule.evaluate(
      createJob({ sourceName: "" }),
    );

    expect(reasons[0]?.reason).toBe(RejectionReason.MissingSourceData);
  });
});
