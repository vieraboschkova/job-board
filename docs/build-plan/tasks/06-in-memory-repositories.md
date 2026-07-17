# Task 06: Implement In-Memory Repositories

Status: MVP

## Purpose

Provide production-shaped storage behavior without adding a database.

## Implementation Details

- Implement `InMemoryJobRepository`.
- Implement `InMemoryRejectedJobRepository`.
- Store approved jobs in memory.
- Store rejected jobs in memory.
- Support job search by title.
- Support country filtering.
- Support salary and posting date sorting.

## Files And Modules Touched

- `server/src/infrastructure/repositories/`
- `server/src/domain/job/`
- backend tests

## Acceptance Criteria

- Approved jobs can be saved and queried.
- Rejected jobs can be saved and listed.
- Search is case-insensitive.
- Country filter works.
- Sort options work predictably.

## Verification Steps

```bash
npm test -w server
npm run typecheck -w server
```

## Prerequisites

- Task 05 complete.

## Handoff Notes

After this task, run Task 07 to add parsing utilities used by normalization.
