# Build Plan Status

## Current Implementation Status

Task 16 is complete. Re-ingesting the same approved source job does not create a second published row. Duplicates match on `sourceName` + `sourceId` or our internal `id`, are skipped (not stored), and appear on the ingest response as `duplicatesCount` + `duplicates` (`sourceName`, `id`, `sourceId`). Next up is Task 17 (README architecture notes).

Last completed task: `16-deduplication.md`.

Next recommended task: `17-readme-architecture-notes.md`.

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
- [x] 12. Add jobs search API
- [x] 13. Build frontend job search UI
- [x] 14. Add sample data demo flow
- [x] 15. Add rejection log endpoint
- [x] 16. Add deduplication
- [ ] 17. Update README architecture notes
- [ ] 18. Final deployment smoke test
- [ ] 19. Add review report export
- [ ] 20. Split published full store from search-only store

## Status Update Rule

After completing a task:

1. mark the task complete in this file
2. update the last completed task
3. update the next recommended task
4. update root `AGENTS.md`

## MVP Tasks

Tasks 01-14, 17, and 18 are required for the MVP.

## Optional Polish Tasks

Tasks 15, 16, 19, and 20 are optional polish.
