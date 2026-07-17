import { describe, expect, it } from "vitest";
import { Language } from "../../../../domain/job/job.enums";
import { detectLanguage } from "../language-detector";

describe("detectLanguage", () => {
  it("detects English", () => {
    expect(
      detectLanguage(
        "Join our backend team to build scalable APIs using Go and microservices architecture.",
      ),
    ).toBe(Language.English);
  });

  it("detects French", () => {
    expect(
      detectLanguage(
        "Rejoignez notre équipe pour développer des modèles de machine learning avancés.",
      ),
    ).toBe(Language.French);
  });

  it("detects German", () => {
    expect(
      detectLanguage(
        "Wir suchen einen erfahrenen Softwareentwickler für unser Team.",
      ),
    ).toBe(Language.German);
  });

  it("returns unknown for empty text", () => {
    expect(detectLanguage("")).toBe(Language.Unknown);
  });

  it("returns unknown for unsupported language", () => {
    expect(detectLanguage("123456789")).toBe(Language.Unknown);
  });
});
