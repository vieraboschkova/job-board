import { ReviewRule } from "../review.types";
import { allowedLanguageRule } from "./allowed-language.rule";
import { allowedLocationRule } from "./allowed-location.rule";
import { fullTimeRule } from "./full-time.rule";
import { noStaffingFirmRule } from "./no-staffing-firm.rule";
import { salaryThresholdRule } from "./salary-threshold.rule";
import { titleRequiredRule } from "./title-required.rule";

export {
  allowedLanguageRule,
  allowedLocationRule,
  fullTimeRule,
  noStaffingFirmRule,
  salaryThresholdRule,
  titleRequiredRule,
};

export const defaultRules: ReviewRule[] = [
  titleRequiredRule,
  allowedLocationRule,
  fullTimeRule,
  salaryThresholdRule,
  noStaffingFirmRule,
  allowedLanguageRule,
];
