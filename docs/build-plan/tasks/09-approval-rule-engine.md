# Task 09: Implement Approval Rule Engine

Status: MVP

## Purpose

Create a testable, extensible approval system for deciding which jobs can be published.

## Implementation Details

- Define `ApprovalRule`.
- Define `ApprovalResult`.
- Define `ApprovalDecision`.
- Implement `ApprovalEngine`.
- Implement required rules:
  - title required
  - allowed location
  - full-time only
  - salary threshold
  - no staffing firms
  - allowed language
- Return all rejection reasons for a failed job.

## Files And Modules Touched

- `server/src/domain/approval/`
- `server/src/domain/approval/rules/`
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

After this task, run Task 10 to connect normalization, approval, and repositories through the ingestion service.
