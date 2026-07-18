# Sample Ingestion Demo

## Purpose

The sample ingestion flow should make the project easy to demonstrate in an interview without relying on hidden seed data or manual database edits.

The reviewer should be able to start the app, ingest sample messy jobs, and immediately see approved jobs in the UI.

## Recommended Sample File

Create this file during Task 14:

```txt
sample-data/jobs.json
```

The payload should match the public ingestion API:

```json
{
  "sourceName": "interview-demo",
  "jobs": []
}
```

## Required Sample Coverage

The sample data should include at least 10 jobs:

- 3 approved US or remote full-time jobs
- 2 approved Canadian jobs, including one French-language Canadian posting
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
  --data @sample-data/jobs.json
```

Search approved jobs:

```bash
curl "http://localhost:3000/api/jobs?search=engineer&sort=salary_desc"
```

Filter Canadian jobs:

```bash
curl "http://localhost:3000/api/jobs?country=CA&sort=postedAt_desc"
```

If the optional rejection endpoint exists:

```bash
curl http://localhost:3000/api/rejections
```

## Demo Ingestion Page

Add a small frontend page for interview/demo use:

```txt
/demo-ingestion
```

The page should make ingestion visible without becoming a full admin tool.

Recommended controls:

- source name text field
- sample scenario selector
- editable JSON text area
- submit ingestion button
- reset to sample button
- ingestion summary panel
- rejected reasons preview if the rejection endpoint exists

Recommended sample scenarios:

- `Mixed sample`: approved and rejected jobs together
- `All review rules`: one example per rule
- `Custom JSON`: user-edited payload

The editable JSON should use the same payload shape as `POST /api/ingest`:

```json
{
  "sourceName": "interview-demo",
  "jobs": []
}
```

On successful ingestion, the page should show:

- received count
- normalized count
- approved count
- rejected count
- errors, if any
- link or button to view approved jobs

Do not make this the primary app page. The primary page should remain the approved jobs search experience.

## Interview Demo Flow

1. Open the live app and show the approved jobs page.
2. Open `/demo-ingestion`.
3. Choose the mixed sample or paste custom JSON.
4. Submit ingestion.
5. Show the ingestion summary: received, approved, rejected, and errors.
6. Return to the approved jobs page.
7. Search for a title keyword.
8. Filter by country.
9. Sort by salary and posting date.
10. Briefly show the code path: API route, ingestion service, normalizer, review engine, publisher, rejector.

## Production Note

Do not rely on automatic startup seeding for the main demo.

Prefer an explicit sample ingestion command because it demonstrates the ingestion API and keeps production behavior easy to explain.

The `/demo-ingestion` page may be available in production for the take-home demo, but label it clearly as demo tooling in code and documentation.
