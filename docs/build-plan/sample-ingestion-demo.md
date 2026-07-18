# Sample Ingestion Demo

## Purpose

The sample ingestion flow should make the project easy to demonstrate in an interview without relying on hidden seed data or manual database edits.

The reviewer should be able to start the app, ingest sample messy jobs via curl or Swagger UI, and immediately see approved jobs in the search UI.

## Recommended Sample Files

Created during Task 14:

```txt
server/src/tests/mock/jobs-10.json
server/src/tests/mock/jobs-20.json
server/src/tests/mock/jobs-50.json
```

Each payload matches the public ingestion API:

```json
{
  "sourceName": "interview-demo-10",
  "jobs": []
}
```

Rough mix: ~30% approved, rest rejected across all seven review rules.

## Required Sample Coverage

The sample data should include at least 10 jobs:

- 3 approved US or remote full-time jobs
- 2 approved Canadian jobs, including one French-language Canadian posting (covered in the 20/50 sets; the 10-job set includes US, CA French, and remote)
- 1 rejection for missing title
- 1 rejection for non-US/non-Canada in-person location
- 1 rejection for non-full-time employment
- 1 rejection for salary below threshold
- 1 rejection for staffing firm company
- 1 rejection for unsupported language

At least three raw jobs should use different field names to prove normalization works.

Examples:

- `title`, `company`, `description`
- `jobTitle`, `companyName`, `body`
- `role`, `employer.name`, `summary`

## Demo Commands

Local health check:

```bash
curl http://localhost:3000/api/health
```

Ingest sample jobs:

```bash
curl -X POST http://localhost:3000/api/ingest \
  -H "Content-Type: application/json" \
  --data @server/src/tests/mock/jobs-10.json
```

Or open Swagger UI at `/api/docs` and paste any `server/src/tests/mock/jobs-*.json` body into `POST /api/ingest`.

Search approved jobs:

```bash
curl "http://localhost:3000/api/jobs/search?search=engineer&sort=salary_desc"
```

Filter Canadian jobs:

```bash
curl "http://localhost:3000/api/jobs/search?country=CA&sort=postedAt_desc"
```

If the optional rejection endpoint exists:

```bash
curl http://localhost:3000/api/rejections
```

## Interview Demo Flow

1. Open the live app and show the (empty or previously populated) approved jobs search page.
2. Open `/api/docs` (Swagger) or run the curl ingest command with a sample file.
3. Submit ingestion and show the summary: received, approved, rejected, and errors.
4. Return to the approved jobs page.
5. Search for a title keyword.
6. Filter by country.
7. Sort by salary and posting date.
8. Briefly show the code path: API route, ingestion service, normalizer, review engine, publisher, rejector.

## Production Note

Do not rely on automatic startup seeding for the main demo.

Prefer an explicit sample ingestion via curl or Swagger because it demonstrates the ingestion API and keeps production behavior easy to explain.

No `/demo-ingestion` UI page — Swagger covers interactive ingest for the take-home demo.
