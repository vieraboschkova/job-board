# Backend Design

## Project Structure

Recommended backend structure:

```txt
server/
  src/
    app.ts
    server.ts
    config/
    domain/
    workflows/
    infrastructure/
    api/
    tests/
```

## Core Types

Use permissive raw input and strict normalized internal models.

Key types:

- `RawJobPosting = Record<string, unknown>`
- `Job`
- `Salary`
- `Location`
- `Job`
- `RejectedJob`
- `RejectionReason`

Recommended enums/unions:

- `EmploymentType = "full_time" | "part_time" | "contract" | "internship" | "unknown"`
- `CountryCode = "US" | "CA" | "UK" | "UNKNOWN"`
- `SalaryUnit = "annual" | "hourly" | "unknown"`

## Ingestion Interfaces

The ingestion contract:

```ts
interface JobIngester {
  ingest(
    rawJobs: RawJobPosting[],
    sourceName: string,
  ): Promise<IngestionResult>;
}
```

`JobIngestionService` implements `JobIngester` and depends on `JobNormalizer`, `ReviewEngine`, `JobPublisher`, and `JobRejector` — not repositories directly.

```ts
interface JobPublisher {
  publish(job: Job): Promise<PublishedJob>;
}

interface JobRejector {
  reject(job: Job, rejectionReasons: RejectionDetail[]): Promise<RejectedJob>;
}
```

`IngestionResult` should include:

- received count
- normalized count
- approved count
- rejected count
- per-record errors

## Normalization Pipeline

Pipeline:

```txt
raw job
  -> field extraction
  -> title/company/description normalization
  -> employment type parsing
  -> salary parsing
  -> location parsing
  -> posted date parsing
  -> normalized job
```

Normalization should never fail the whole batch for one malformed record. Preserve the original raw job inside the normalized model.

## Review Rules

Review should use composable rule objects:

```ts
interface ReviewRule {
  name: string;
  evaluate(job: Job): ReviewResult;
}
```

Required rules:

1. title must be present
2. job must be remote, or in-person in the United States or Canada
3. employment type must be full-time
4. salary must be over 100,000 USD annually or above 45 USD hourly
5. company must not be a staffing firm
6. description language must be English, or French for Canada jobs

The engine should return all rejection reasons, not only the first failure.

## Repository Interfaces

Use interfaces even though MVP storage is in-memory.

```ts
interface PublishedJobRepository {
  save(job: PublishedJob): Promise<PublishedJob>;
  search(query: JobSearchQuery): Promise<PublishedJob[]>;
  getAll(): Promise<PublishedJob[]>;
}

interface RejectedJobRepository {
  save(job: RejectedJob): Promise<RejectedJob>;
  getAll(): Promise<RejectedJob[]>;
}
```

## API Endpoints

Required:

- `GET /api/health`
- `POST /api/ingest`
- `GET /api/jobs`

Optional polish:

- `GET /api/rejections`
- `GET /api/reports/review-decisions.csv`

`GET /api/jobs` should support:

- `search`
- `country`
- `sort=salary_asc`
- `sort=salary_desc`
- `sort=postedAt_asc`
- `sort=postedAt_desc`
