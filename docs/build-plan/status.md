# Build Plan Status

## Current Implementation Status

Task 11 is complete. Clients can `POST /api/ingest` with a validated `{ sourceName, jobs }` body; the API calls `JobIngester` and returns ingestion summary counts. Invalid bodies return 400. Swagger UI is available at `/api/docs`.

Last completed task: `11-ingestion-api.md`.

Next recommended task: `12-jobs-search-api.md`.

## Task Checklist

- [x] 01. Scaffold monorepo shell
- [x] 02. Add health endpoint and placeholder UI
- [x] 03. Configure production static serving
- [x] 04. Deploy thin shell
- [x] 05. Define domain types and repository interfaces
- [x] 06. Implement in-memory repositories
- [x] 07. Implement parsing utilities
- [x] 08. Build job normalizer
- [x] 09. Implement review rule engine
- [x] 10. Implement ingestion service
- [x] 11. Add ingestion API
- [ ] 12. Add jobs search API
- [ ] 13. Build frontend job search UI
- [ ] 14. Add sample data demo flow
- [ ] 15. Add rejection log endpoint
- [ ] 16. Add deduplication
- [ ] 17. Update README architecture notes
- [ ] 18. Final deployment smoke test
- [ ] 19. Add review report export

## Status Update Rule

After completing a task:

1. mark the task complete in this file
2. update the last completed task
3. update the next recommended task
4. update root `AGENTS.md`

## MVP Tasks

Tasks 01-14, 17, and 18 are required for the MVP.

## Optional Polish Tasks

Tasks 15, 16, and 19 are optional polish.
