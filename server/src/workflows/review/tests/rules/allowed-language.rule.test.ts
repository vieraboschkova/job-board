import { describe, expect, it } from "vitest";

import { CountryCode, Language } from "../../../../domain/job/job.enums";
import { RejectionReason } from "../../../../domain/review/review.enums";
import { allowedLanguageRule } from "../../rules/allowed-language.rule";
import { createJob } from "../create-job";

describe("allowedLanguageRule", () => {
  it("approves English jobs anywhere", () => {
    expect(allowedLanguageRule.evaluate(createJob())).toEqual([]);
  });

  it("approves French jobs in Canada", () => {
    const reasons = allowedLanguageRule.evaluate(
      createJob({
        language: Language.French,
        location: { country: CountryCode.CA, remote: false },
      }),
    );

    expect(reasons).toEqual([]);
  });

  it("approves French remote jobs in Canada", () => {
    const reasons = allowedLanguageRule.evaluate(
      createJob({
        language: Language.French,
        location: { country: CountryCode.CA, remote: true },
      }),
    );

    expect(reasons).toEqual([]);
  });

  it("rejects French jobs outside Canada", () => {
    const reasons = allowedLanguageRule.evaluate(
      createJob({
        language: Language.French,
        location: { country: CountryCode.US, remote: false },
      }),
    );

    expect(reasons[0]?.reason).toBe(RejectionReason.InvalidLanguage);
  });

  it("rejects unknown and other languages", () => {
    for (const language of [
      Language.Unknown,
      Language.German,
      Language.Spanish,
    ]) {
      const reasons = allowedLanguageRule.evaluate(createJob({ language }));

      expect(reasons[0]?.reason).toBe(RejectionReason.InvalidLanguage);
    }
  });
});
