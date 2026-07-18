import { describe, expect, it } from "vitest";

import {
  COMPANY_TYPE_FIELDS,
  EMPLOYMENT_TYPE_FIELDS,
  LANGUAGE_FIELDS,
  LOCATION_FIELDS,
  POSTING_DATE_FIELDS,
  SALARY_FIELDS,
  SOURCE_ID_FIELDS,
} from "../field-keys";

describe("field-keys", () => {
  it("includes source id aliases", () => {
    expect(SOURCE_ID_FIELDS).toEqual([
      "sourceId",
      "id",
      "jobId",
      "job_id",
      "externalId",
    ]);
  });

  it("includes employment type aliases", () => {
    expect(EMPLOYMENT_TYPE_FIELDS).toEqual([
      "employment_type",
      "employmentType",
    ]);
  });

  it("includes posting date aliases", () => {
    expect(POSTING_DATE_FIELDS).toEqual([
      "posting_date",
      "postedAt",
      "posted_date",
    ]);
  });

  it("includes company type aliases", () => {
    expect(COMPANY_TYPE_FIELDS).toEqual(["company_type", "companyType"]);
  });

  it("includes salary aliases", () => {
    expect(SALARY_FIELDS).toEqual(["salary", "compensation", "pay"]);
  });

  it("includes location and language fields", () => {
    expect(LOCATION_FIELDS).toEqual(["location"]);
    expect(LANGUAGE_FIELDS).toEqual(["language"]);
  });
});
