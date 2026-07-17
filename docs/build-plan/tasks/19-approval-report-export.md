# Task 19: Add Approval Report Export

Status: Optional polish

## Purpose

Create a downloadable report that shows every ingested job and whether it was approved or rejected.

This is useful for interview demos because it makes the approval pipeline auditable.

## Implementation Details

- Add a report endpoint after ingestion and rejection logging exist.
- Prefer CSV for the first implementation because it is easy to generate, inspect, and open in Excel.
- Optionally add true `.xlsx` export later with a library such as `exceljs`.
- Include both approved and rejected jobs.
- Include rejection reasons for rejected jobs.
- Include enough normalized fields to explain the decision.

Recommended endpoint:

```txt
GET /api/reports/approval-decisions.csv
```

Optional endpoint:

```txt
GET /api/reports/approval-decisions.xlsx
```

Recommended report columns:

- status
- title
- company
- country
- remote
- employment type
- salary min
- salary max
- salary unit
- posted at
- source name
- source id or external id
- rejection reason codes
- rejection reason messages

## Files And Modules Touched

- `server/src/api/routes/`
- `server/src/api/controllers/`
- `server/src/application/`
- `server/src/infrastructure/reports/`
- backend tests
- optionally frontend download button

## Acceptance Criteria

- CSV report downloads successfully.
- Approved jobs appear with `approved` status.
- Rejected jobs appear with `rejected` status and rejection reasons.
- Report escapes commas, quotes, and newlines correctly.
- The report can be opened in Excel or Google Sheets.
- Optional frontend button links to the report endpoint.

## Verification Steps

```bash
curl -o approval-decisions.csv http://localhost:3000/api/reports/approval-decisions.csv
```

Open the CSV in Excel, Numbers, or Google Sheets and confirm rows and columns are readable.

## Prerequisites

- Task 10 complete.
- Task 11 complete.
- Task 12 complete.
- Task 15 recommended if rejection listing is already exposed.

## Handoff Notes

Keep this feature read-only. Do not let report generation mutate stored jobs or rejection logs.
