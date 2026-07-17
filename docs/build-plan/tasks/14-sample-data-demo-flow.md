# Task 14: Add Sample Data Demo Flow

Status: MVP

## Purpose

Make the app easy for a reviewer to populate and evaluate.

## Implementation Details

- Add a sample JSON file with messy job postings.
- Include approved and rejected examples.
- Cover multiple source formats.
- Document a curl command for ingesting the sample data.
- Follow the demo contract in `docs/build-plan/sample-ingestion-demo.md`.
- Include enough records to show every review rule passing or failing.
- Add a secondary `/demo-ingestion` page for submitting sample or custom ingestion payloads from the UI.
- Keep the approved jobs search page as the primary product page.
- Keep production behavior simple and avoid hidden automatic data mutation unless clearly documented.

## Files And Modules Touched

- `sample-data/` or `server/src/tests/fixtures/`
- `client/src/pages/`
- `client/src/api/`
- `README.md`
- `docs/build-plan/status.md`

## Acceptance Criteria

- Reviewer can ingest sample jobs with one documented command.
- Sample data includes jobs that pass and fail review.
- Sample data covers messy salary, location, language, and employment type cases.
- Sample data includes at least 10 jobs and covers all required review rules.
- At least three jobs use different raw field shapes.
- `/demo-ingestion` lets the user choose a sample payload, edit JSON, submit ingestion, and see summary counts.
- The frontend shows approved sample jobs after ingestion.

## Verification Steps

```bash
curl -X POST http://localhost:3000/api/ingest \
  -H "Content-Type: application/json" \
  --data @sample-data/jobs.json
curl http://localhost:3000/api/jobs
```

Open `/demo-ingestion`, submit the mixed sample, then return to the approved jobs page and confirm approved jobs appear.

## Prerequisites

- Task 11 complete.
- Task 12 complete.
- Task 13 complete.

## Handoff Notes

After this task, the core MVP behavior should be demonstrable. Task 15 and Task 16 are optional polish.
