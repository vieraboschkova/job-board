# Task 09: Implement Review Rule Engine

Status: MVP

## Purpose

Create a testable, extensible review system for deciding which jobs can be published.

## Implementation Details

- Define `ReviewRule`.
- Define `ReviewResult`.
- Define `ReviewDecision`.
- Implement `ReviewEngine`.
- Implement required rules:
  - title required
  - allowed location
  - full-time only
  - salary threshold
  - no staffing firms
  - allowed language
- Return all rejection reasons for a failed job.

## Files And Modules Touched

- `server/src/domain/review/` (types and enums)
- `server/src/workflows/review/` (engine, rules, and tests)
- backend tests

## Acceptance Criteria

- A valid job passes all rules.
- Each required rejection path has a stable reason code.
- Jobs with multiple failures return multiple reasons.
- Adding a future rule does not require changing existing rules.

## Verification Steps

```bash
npm test -w server
npm run typecheck -w server
```

## Prerequisites

- Task 05 complete.
- Task 07 complete.
- Task 08 complete.

## Handoff Notes

After this task, run Task 10 to connect normalization, review, and publisher/rejector through the ingestion service.
