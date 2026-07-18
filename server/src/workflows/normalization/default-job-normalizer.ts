import { randomUUID } from "node:crypto";

import {
  JobNormalizer,
  RawJobPosting,
} from "../../domain/ingestion/ingestion.types";
import { Job } from "../../domain/job/job.types";
import {
  isRecord,
  parseCompany,
  parseDescription,
  parseTitle,
} from "./parsers";
import {
  extractCompanyType,
  extractEmploymentType,
  extractLanguage,
  extractPostedAt,
  extractSalary,
  extractSourceId,
  resolveLocation,
} from "./utils";

export class DefaultJobNormalizer implements JobNormalizer {
  normalize(rawJob: RawJobPosting, sourceName: string): Job {
    const rawData = isRecord(rawJob) ? structuredClone(rawJob) : {};
    const description = parseDescription(rawData) ?? "";
    const sourceId = extractSourceId(rawData);

    return {
      id: randomUUID(),
      title: parseTitle(rawData) ?? "",
      company: parseCompany(rawData) ?? "",
      description,
      language: extractLanguage(rawData, description),
      location: resolveLocation(rawData),
      salary: extractSalary(rawData),
      employmentType: extractEmploymentType(rawData),
      companyType: extractCompanyType(rawData),
      sourceName,
      rawData,
      postedAt: extractPostedAt(rawData),
      createdAt: new Date(),
      sourceId,
    };
  }
}
