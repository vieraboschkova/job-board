# Task 10: Implement Ingestion Service

Status: MVP

## Purpose

Wire normalization, review, approved storage, and rejection logging into one workflow service.

## Implementation Details

- Implement `JobIngester` / `JobIngestionService`.
- Accept raw jobs and source name.
- Normalize each raw job.
- Evaluate each normalized job.
- Publish approved jobs via `JobPublisher`.
- Reject jobs with reasons via `JobRejector`.
- Return ingestion summary counts.
- Capture per-record errors without failing the whole batch.

## Files And Modules Touched

- `server/src/domain/ingestion/`
- `server/src/workflows/ingestion`
- `server/src/workflows/publishing`
- `server/src/workflows/rejection`
- backend tests

## Acceptance Criteria

- Mixed batches produce correct approved and rejected counts.
- Approved jobs are saved.
- Rejected jobs are logged with reasons.
- One malformed record does not stop the batch.
- The service depends on `JobPublisher` / `JobRejector` interfaces, not repositories.

## Verification Steps

```bash
npm test -w server
npm run typecheck -w server
```

## Prerequisites

- Task 06 complete.
- Task 08 complete.
- Task 09 complete.

## Handoff Notes

After this task, run Task 11 to expose ingestion through an API endpoint.
