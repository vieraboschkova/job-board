# Task 17: Update README Architecture Notes

Status: MVP

## Purpose

Make the project easy for a reviewer to understand, run, test, and deploy.

## Implementation Details

- Update root `README.md`.
- Include project summary.
- Include architecture overview.
- Include local setup commands.
- Include test commands.
- Include production build/start commands.
- Include deployment notes and live URL if available.
- Include sample ingestion command.
- Document intentional simplifications.

## Files And Modules Touched

- `README.md`
- optionally `docs/build-plan/status.md`
- optionally `AGENTS.md`

## Acceptance Criteria

- A reviewer can run the app locally from README instructions.
- A reviewer can ingest sample data from README instructions.
- Architecture tradeoffs are clear.
- Deployment approach is documented.
- Current live URL is included if one exists.

## Verification Steps

Follow the README from a fresh checkout:

```bash
npm install
npm run build
npm start
npm test
```

## Prerequisites

- Task 14 complete.
- Task 04 complete if a live URL should be documented.

## Handoff Notes

After this task, run Task 18 for final deployment and smoke testing.
