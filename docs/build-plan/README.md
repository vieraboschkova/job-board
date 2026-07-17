# Job Board Build Plan

## Summary

This folder contains the implementation plan for a take-home job ingestion, review, and search system.

The original assignment prompt is preserved in `docs/build-plan/original-task.md`. Use it as the source reference when checking whether implementation tasks still satisfy the requested scope.

The app will use:

- Node.js backend
- TypeScript
- React frontend
- Material UI
- Clean, testable architecture

The goal is to build a production-shaped system without unnecessary operational complexity.

## Recommended Architecture

Use a single Node.js service for the take-home project.

The service should:

- expose REST API routes under `/api`
- run the ingestion module in-process
- serve the built React frontend in production
- keep ingestion, review, storage, and API layers separated

The ingestion module should be designed so it can later be moved into a worker, queue consumer, or standalone service without rewriting the core normalization and review logic.

## MVP Definition

The MVP is complete when:

- the app runs locally
- a deployed thin shell exists early in the project
- `/api/health` works locally and in production
- messy job JSON can be ingested
- jobs are normalized into a common model
- all required review rules are enforced
- approved jobs are searchable
- rejected jobs are logged with reasons
- the React/MUI UI lists, searches, filters, and sorts approved jobs
- core domain and API behavior is tested

## Suggested Implementation Order

Run the task files in numeric order from `docs/build-plan/tasks/`.

The early deployment sequence is intentional:

1. scaffold a thin shell
2. add health endpoint and placeholder UI
3. make the shell production-buildable
4. deploy the shell
5. continue with domain, ingestion, API, and UI work

This prevents deployment from becoming a late surprise.

## Independent Task Execution

Each task file includes:

- purpose
- implementation details
- expected files or modules touched
- acceptance criteria
- verification steps
- prerequisites
- handoff notes

Tasks are sized for roughly 30-90 minutes each.

When reviewing a completed task, compare behavior against `original-task.md` if the task touches ingestion, review rules, storage, rejected-job logging, or the search/filter/sort UX.

## Interview Demo Flow

Use `sample-ingestion-demo.md` as the target demo script.

The intended interview flow is:

1. open the deployed app
2. show the health endpoint or placeholder shell if early in development
3. open `/demo-ingestion`
4. ingest `sample-data/jobs.json` or a custom JSON payload
5. show the ingestion summary
6. search, filter, and sort approved jobs in the UI
7. explain the code path from API route to ingestion service, normalizer, review engine, and repositories

## Important Tradeoffs

- Use in-memory repositories for the MVP, but hide them behind interfaces.
- Use simple parsing for locations and salary.
- Use a lightweight language heuristic instead of a heavyweight external dependency.
- Prefer a single deployable Node service over separate frontend/backend hosting.
- Treat review report export as optional polish: CSV is enough for Excel compatibility, true `.xlsx` can be added later.
