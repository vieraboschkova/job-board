# Task 05: Define Domain Types And Repository Interfaces

Status: MVP

## Purpose

Create stable backend domain contracts before implementing ingestion and approval logic.

## Implementation Details

- Define permissive raw job input type.
- Define normalized job model.
- Define approved job model.
- Define rejected job model with rejection reasons.
- Define job search query type.
- Define approved and rejected repository interfaces.
- Keep these types independent from Express.

## Files And Modules Touched

- `server/src/domain/job/`
- `server/src/domain/ingestion/`
- `server/src/domain/approval/`

## Acceptance Criteria

- Domain types compile.
- Repository interfaces are defined.
- No persistence implementation is added in this task.
- No Express types leak into domain modules.

## Verification Steps

```bash
npm run typecheck -w server
```

## Prerequisites

- Task 01 complete.

## Handoff Notes

After this task, run Task 06 to implement in-memory repositories behind these interfaces.
