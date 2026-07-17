import { Language } from "../../../domain/job/job.enums";
import { detectLanguage } from "../language/language-detector";
import { languageMap } from "../language/language-map";
import { parseString } from "./common/parse-string";

function parseProvidedLanguage(value: string): Language {
  const normalized = value.trim().toLowerCase();

  return languageMap[normalized] ?? Language.Unknown;
}

export function parseLanguage(
  value: unknown,
  fallbackText?: unknown,
): Language {
  const providedLanguage = parseString(value);

  if (providedLanguage) {
    return parseProvidedLanguage(providedLanguage);
  }

  const text = parseString(fallbackText);

  if (!text) {
    return Language.Unknown;
  }

  return detectLanguage(text);
}
