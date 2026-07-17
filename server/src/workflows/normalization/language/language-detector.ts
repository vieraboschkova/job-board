import { franc } from "franc";
import { Language } from "../../../domain/job/job.enums";
import { languageMap } from "./language-map";

export function detectLanguage(text: string): Language {
  const detected = franc(text);

  return languageMap[detected] ?? Language.Unknown;
}
