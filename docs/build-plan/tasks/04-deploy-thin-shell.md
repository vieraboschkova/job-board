# Task 04: Deploy Thin Shell

Status: MVP

## Purpose

Validate deployment early while the app is still small.

## Implementation Details

- Create a Render Web Service.
- Connect the repository.
- Use the root as the service root.
- Set the build command to `npm install && npm run build`.
- Set the start command to `npm start`.
- Set `NODE_ENV=production`.
- Let Render provide `PORT`.

## Files And Modules Touched

- No code changes required unless deployment exposes missing configuration.
- Update `README.md` or `docs/build-plan/deployment.md` with the deployed URL if available.

## Acceptance Criteria

- Live URL loads the placeholder React/MUI page.
- Live `/api/health` returns `{ "status": "ok" }`.
- Deployment commands are documented.

## Verification Steps

```bash
curl https://your-app.onrender.com/api/health
```

Open the live app URL in a browser.

## Prerequisites

- Task 03 complete.
- Repository pushed to a remote Render can access.

## Handoff Notes

After this task, continue with Task 05. Keep deployment working after each major feature.
