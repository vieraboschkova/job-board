# Task 12: Add Jobs Search API

Status: MVP

## Purpose

Expose approved jobs to the frontend.

## Implementation Details

- Add `GET /api/jobs`.
- Support optional query parameters:
  - `search`
  - `country`
  - `sort`
- Return approved jobs only.
- Supported sort values:
  - `salary_asc`
  - `salary_desc`
  - `postedAt_asc`
  - `postedAt_desc`
- Ignore or default invalid sort values safely.

## Files And Modules Touched

- `server/src/api/routes/jobRoutes.ts`
- `server/src/api/controllers/jobController.ts`
- `server/src/workflows/search/`
- backend API tests

## Acceptance Criteria

- API lists approved jobs.
- Search by title works.
- Country filter works.
- Salary sorting works.
- Posted date sorting works.

## Verification Steps

```bash
npm test -w server
curl "http://localhost:3000/api/jobs?search=engineer&country=US&sort=salary_desc"
```

## Prerequisites

- Task 06 complete.
- Task 11 complete.

## Handoff Notes

After this task, run Task 13 to build the React/MUI search UI.
