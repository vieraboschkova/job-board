# Task 15: Add Rejection Log Endpoint

Status: Optional polish

## Purpose

Expose rejected jobs for debugging and reviewer visibility.

## Implementation Details

- Add `GET /api/rejections`.
- Return rejected jobs with rejection reasons.
- Keep the endpoint simple.
- Do not build a full admin system.
- Optionally add a small frontend debug view only if time allows.

## Files And Modules Touched

- `server/src/api/routes/`
- `server/src/api/controllers/`
- `server/src/application/`
- backend API tests

## Acceptance Criteria

- Rejected jobs can be listed.
- Rejection reasons are visible.
- Endpoint does not expose anything beyond the take-home demo data.

## Verification Steps

```bash
npm test -w server
curl http://localhost:3000/api/rejections
```

## Prerequisites

- Task 10 complete.
- Task 11 complete.

## Handoff Notes

After this task, consider Task 16 if duplicate ingestion is likely during demos.
