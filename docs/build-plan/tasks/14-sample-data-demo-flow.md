# Task 14: Add Sample Data Demo Flow

Status: MVP

## Purpose

Make the app easy for a reviewer to populate and evaluate.

## Implementation Details

- Add sample JSON files with messy job postings under `server/src/tests/mock/`.
- Include approved and rejected examples (~30% approved).
- Cover multiple source formats / raw field shapes.
- Document curl (and Swagger) commands for ingesting the sample data.
- Follow the demo contract in `docs/build-plan/sample-ingestion-demo.md`.
- Include enough records to show every review rule passing or failing.
- Use Swagger UI at `/api/docs` for interactive ingest — no separate `/demo-ingestion` UI page.
- Keep the approved jobs search page as the primary product page.
- Keep production behavior simple and avoid hidden automatic data mutation unless clearly documented.

## Files And Modules Touched

- `server/src/tests/mock/`
- `README.md`
- `docs/build-plan/status.md`
- `AGENTS.md`

## Acceptance Criteria

- Reviewer can ingest sample jobs with one documented command (or Swagger Try it out).
- Sample data includes jobs that pass and fail review.
- Sample data covers messy salary, location, language, and employment type cases.
- Sample data includes at least 10 jobs and covers all required review rules.
- At least three jobs use different raw field shapes.
- The frontend jobs search page shows approved sample jobs after ingestion.

## Verification Steps

```bash
curl -X POST http://localhost:3000/api/ingest \
  -H "Content-Type: application/json" \
  --data @server/src/tests/mock/jobs-10.json
curl "http://localhost:3000/api/jobs/search"
```

Or open `/api/docs`, run `POST /api/ingest` with a sample payload, then confirm approved jobs on the search UI.

## Prerequisites

- Task 11 complete.
- Task 12 complete.
- Task 13 complete.

## Handoff Notes

After this task, the core MVP behavior should be demonstrable. Task 15 and Task 16 are optional polish.
