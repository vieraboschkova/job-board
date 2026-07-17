# Task 16: Add Deduplication

Status: Optional polish

## Purpose

Avoid duplicate approved jobs when the same sample or source feed is ingested multiple times.

## Implementation Details

- Compute a stable dedupe key.
- Prefer `sourceName + externalId` when available.
- Fall back to `title + companyName + postedAt`.
- Decide whether duplicates are skipped or updated.
- Include duplicate count in ingestion result if useful.

## Files And Modules Touched

- `server/src/domain/job/`
- `server/src/infrastructure/repositories/`
- `server/src/application/`
- backend tests

## Acceptance Criteria

- Re-ingesting the same source job does not create duplicate approved jobs.
- Dedupe behavior is documented.
- Tests cover external ID and fallback dedupe paths.

## Verification Steps

```bash
npm test -w server
```

Manually ingest the same sample data twice and confirm duplicates are not created.

## Prerequisites

- Task 10 complete.
- Task 14 recommended.

## Handoff Notes

After this task, run Task 17 to finalize README documentation.
