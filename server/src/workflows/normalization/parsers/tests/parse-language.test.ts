import { describe, expect, it } from "vitest";
import { Language } from "../../../../domain/job/job.enums";
import { parseLanguage } from "../parse-language";

describe("parseLanguage", () => {
  it("parses provided English language", () => {
    expect(parseLanguage("English")).toBe(Language.English);
  });

  it("parses provided language ignoring case and whitespace", () => {
    expect(parseLanguage("  FRENCH ")).toBe(Language.French);
  });

  it("uses provided language instead of detecting from text", () => {
    expect(
      parseLanguage(
        "English",
        "Rejoignez notre équipe pour développer des modèles avancés.",
      ),
    ).toBe(Language.English);
  });

  it("detects language from fallback text", () => {
    expect(
      parseLanguage(
        undefined,
        "Rejoignez notre équipe pour développer des modèles de machine learning avancés.",
      ),
    ).toBe(Language.French);
  });

  it("returns unknown when no language and no fallback text exist", () => {
    expect(parseLanguage(undefined)).toBe(Language.Unknown);
  });

  it("returns unknown for unsupported provided language", () => {
    expect(parseLanguage("Klingon")).toBe(Language.Unknown);
  });

  it("returns unknown for empty values", () => {
    expect(parseLanguage("", " ")).toBe(Language.Unknown);
  });
});
