# Task 01: Scaffold Monorepo Shell

Status: MVP

## Purpose

Create the basic workspace structure for the Node/TypeScript backend and React/TypeScript frontend.

## Implementation Details

- Create a root npm workspace.
- Create `server/` for the backend.
- Create `client/` for the frontend.
- Configure TypeScript for both workspaces.
- Add root scripts for `dev`, `build`, `start`, `test`, and `typecheck`.
- Use Vite for the React app.
- Install Material UI dependencies in the client.

## Files And Modules Touched

- `package.json`
- `server/package.json`
- `server/tsconfig.json`
- `server/src/`
- `client/package.json`
- `client/tsconfig.json`
- `client/src/`
- Vite config files as needed

## Acceptance Criteria

- `npm install` succeeds.
- `npm run dev` starts backend and frontend dev workflows.
- `npm run build` has a defined script, even if later tasks expand behavior.
- `npm run typecheck` has a defined script.
- No domain logic is implemented yet.

## Verification Steps

```bash
npm install
npm run typecheck
npm run dev
```

## Prerequisites

None.

## Handoff Notes

After this task, run Task 02 to add the first vertical slice: backend health endpoint plus placeholder UI.
