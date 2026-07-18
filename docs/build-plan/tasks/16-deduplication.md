# Task 16: Add Deduplication

Status: Complete

## Purpose

Avoid duplicate approved jobs when the same sample or source feed is ingested multiple times.

## Implementation Details

- Match duplicates by `sourceName` + `sourceId`, or by our internal `id`.
- Skip duplicates (do not store a second published row).
- Report skips on the ingest result as `duplicatesCount` and `duplicates` (`sourceName`, `id`, `sourceId`).
- Log the duplicates list once per batch when non-empty.

## Files And Modules Touched

- `server/src/domain/job/`
- `server/src/infrastructure/repositories/`
- `server/src/workflows/`
- backend tests

## Acceptance Criteria

- Re-ingesting the same source job does not create duplicate approved jobs.
- Dedupe behavior is documented.
- Tests cover source identity and our-id dedupe paths.

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
