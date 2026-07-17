# Task 02: Add Health Endpoint And Placeholder UI

Status: MVP

## Purpose

Create the first end-to-end vertical slice between backend and frontend.

## Implementation Details

- Add `GET /api/health` to the Express server.
- Return `{ "status": "ok" }`.
- Add a placeholder React/MUI page.
- Have the page call `/api/health` and display the result.
- Configure local frontend proxy to the backend if needed.

## Files And Modules Touched

- `server/src/app.ts`
- `server/src/server.ts`
- `server/src/api/routes/healthRoutes.ts`
- `client/src/App.tsx`
- `client/src/api/`
- Vite config if proxy setup is needed

## Acceptance Criteria

- Backend responds to `GET /api/health`.
- Frontend renders a simple Material UI page.
- Frontend displays backend health status.
- Errors are displayed clearly if the health check fails.

## Verification Steps

```bash
curl http://localhost:3000/api/health
npm run dev
```

Open the frontend dev URL and confirm the health status appears.

## Prerequisites

- Task 01 complete.

## Handoff Notes

After this task, run Task 03 to make the shell production-buildable and serve the frontend through Node.
