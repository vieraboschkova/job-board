# Task 03: Configure Production Static Serving

Status: MVP

## Purpose

Make the thin shell deployable as one Node service.

## Implementation Details

- Build the React frontend into `client/dist`.
- Configure the backend to serve static files from the built frontend directory in production.
- Keep API routes under `/api/*`.
- Return `index.html` for non-API routes.
- Ensure `npm run build` builds both workspaces.
- Ensure `npm start` starts the compiled backend.

## Files And Modules Touched

- root `package.json`
- `server/src/app.ts`
- `server/src/config/env.ts`
- `server/package.json`
- `client/package.json`

## Acceptance Criteria

- `npm run build` succeeds.
- `npm start` starts the backend.
- The built React app is served by Node.
- `/api/health` still works in production mode.

## Verification Steps

```bash
npm run build
npm start
curl http://localhost:3000/api/health
```

Open `http://localhost:3000` and confirm the placeholder UI loads.

## Prerequisites

- Task 01 complete.
- Task 02 complete.

## Handoff Notes

After this task, run Task 04 and deploy the thin shell before building the rest of the product.
