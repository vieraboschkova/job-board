# Task 11: Add Ingestion API

Status: MVP

## Purpose

Allow clients and demo scripts to ingest messy job JSON through HTTP.

## Implementation Details

- Add `POST /api/ingest`.
- Accept body shape `{ "sourceName": string, "jobs": RawJobPosting[] }`.
- Validate that `sourceName` is a non-empty string.
- Validate that `jobs` is an array.
- Call `JobIngester`.
- Return ingestion summary.
- Return 400 for invalid request bodies.

## Files And Modules Touched

- `server/src/api/routes/ingestionRoutes.ts`
- `server/src/api/controllers/ingestionController.ts`
- `server/src/app.ts`
- backend API tests

## Acceptance Criteria

- Valid ingestion payload returns summary counts.
- Invalid payload returns 400.
- Approved jobs become available to the repository.
- Rejected jobs are logged.

## Verification Steps

```bash
npm test -w server
curl -X POST http://localhost:3000/api/ingest \
  -H "Content-Type: application/json" \
  -d '{"sourceName":"sample","jobs":[]}'
```

## Prerequisites

- Task 10 complete.

## Handoff Notes

After this task, run Task 12 to expose approved jobs through search API.
