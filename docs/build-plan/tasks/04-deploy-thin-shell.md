# Task 04: Deploy Thin Shell

Status: MVP

## Purpose

Validate CI and deployment early while the app is still small.

## Implementation Details

- Add a GitHub Actions CI workflow for pull requests and pushes to `main`.
- Add ESLint and Prettier configuration for the TypeScript workspaces.
- Add root scripts for `lint`, `format`, and `format:check`.
- The CI workflow should install dependencies, check formatting, lint, typecheck, run tests, and build.
- Confirm CI passes before deploying the thin shell.
- Create a Render Web Service.
- Connect the repository.
- Use the root as the service root.
- Set the build command to `npm install && npm run build`.
- Set the start command to `npm start`.
- Set `NODE_ENV=production`.
- Let Render provide `PORT`.

## Files And Modules Touched

- `.github/workflows/ci.yml`
- ESLint and Prettier config files
- `package.json`
- workspace package files if lint scripts need workspace-level commands
- No application code changes required unless CI or deployment exposes missing configuration.
- Update `README.md` or `docs/build-plan/deployment.md` with the deployed URL if available.

## Acceptance Criteria

- CI runs on pull requests and pushes to `main`.
- `npm run lint`, `npm run format:check`, and `npm run format` are defined.
- CI passes `npm run format:check`, `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build`.
- Deployment happens only after CI passes.
- Live URL loads the placeholder React/MUI page.
- Live `/api/health` returns `{ "status": "ok" }`.
- CI and deployment commands are documented.

## Verification Steps

```bash
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build
```

Confirm the remote CI workflow passes, then deploy and verify:

```bash
curl https://your-app.onrender.com/api/health
```

Open the live app URL in a browser.

## Prerequisites

- Task 03 complete.
- Repository pushed to a remote Render can access.

## Handoff Notes

After this task, continue with Task 05. Keep deployment working after each major feature.
