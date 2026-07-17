# Task 08: Build Job Normalizer

Status: MVP

## Purpose

Convert multiple messy raw job formats into the common internal model.

## Implementation Details

- Create a `JobNormalizer` interface.
- Implement a default normalizer.
- Extract title from likely fields such as `title`, `jobTitle`, `position`, and `role`.
- Extract company from likely fields such as `company`, `companyName`, and nested employer fields.
- Extract description from likely fields such as `description`, `body`, and `summary`.
- Use parsing utilities for salary, location, employment type, and date.
- Preserve the original raw payload.

## Files And Modules Touched

- `server/src/domain/ingestion/`
- `server/src/infrastructure/parsing/`
- backend tests and fixtures

## Acceptance Criteria

- Different raw formats produce a consistent normalized model.
- Malformed records do not crash normalization.
- Raw input is preserved in the normalized job.
- Missing fields become null or unknown values.

## Verification Steps

```bash
npm test -w server
npm run typecheck -w server
```

## Prerequisites

- Task 05 complete.
- Task 07 complete.

## Handoff Notes

After this task, run Task 09 to implement review rules against the normalized model.
