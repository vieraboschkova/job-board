# Task 18: Final Deployment Smoke Test

Status: MVP

## Purpose

Verify the completed MVP works in production.

## Implementation Details

- Deploy the latest main branch to Render.
- Confirm build succeeds.
- Confirm the frontend loads.
- Confirm `/api/health` works.
- Confirm approved jobs can be queried.
- Confirm sample ingestion flow works if the endpoint is publicly usable.
- Update documentation with any final deployment notes.

## Files And Modules Touched

- `README.md`
- `docs/build-plan/status.md`
- `AGENTS.md`
- deployment platform settings if needed

## Acceptance Criteria

- Live app loads successfully.
- Live health endpoint returns ok.
- Search UI works against live API.
- Sample data flow is verified or clearly documented as local-only.
- README contains the final live URL if available.

## Verification Steps

```bash
curl https://your-app.onrender.com/api/health
curl "https://your-app.onrender.com/api/jobs?search=engineer"
```

Open the live app in a browser and test search, filter, and sort.

## Prerequisites

- All MVP implementation tasks complete.
- Render service configured.

## Handoff Notes

After this task, mark the MVP complete in `docs/build-plan/status.md` and `AGENTS.md`.
