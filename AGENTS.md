# Agent Working Notes

## Current Status

This repository is in the planning/documentation phase. No application scaffold has been created yet.

Current phase: build plan complete, implementation not started.

Last completed task: none.

Next recommended task: `docs/build-plan/tasks/01-scaffold-monorepo-shell.md`.

## Project Intent

Build a take-home job ingestion, approval, and search system using Node.js, TypeScript, React, and Material UI.

The system should ingest messy job posting JSON from multiple formats, normalize each posting into a common model, approve or reject jobs using explicit business rules, store approved jobs for search, log rejected jobs with reasons, and provide a simple UI for searching, filtering, and sorting approved jobs.

## Key Architecture Decisions

- Ingestion is a separate backend module, not a separately deployed service. Has to be able to be extracted easily later.
- Ingestion runs in-process for the take-home version.
- The ingestion module must use clear interfaces so it can later be extracted into a worker, queue consumer, or standalone service.
- The simplest deployment target is a single Node service that serves both API routes and the built React frontend.
- Deploy a thin working shell early, before implementing the full product.

## How To Use The Build Plan

- Start with `docs/build-plan/README.md` for the project overview.
- Use `docs/build-plan/status.md` to see progress and the next task.
- Execute task files in `docs/build-plan/tasks/` in numeric order unless there is a clear reason to branch.
- Each task file is intended to be independently actionable.
- After completing any task, update both this file and `docs/build-plan/status.md`.

## Agent Rules

- Do not scaffold or implement unrelated functionality while working on a single task.
- Preserve the modular architecture described in `docs/build-plan/architecture.md`.
- Keep domain logic testable and independent from Express and React.
- Prefer repository interfaces over direct persistence coupling.
- Keep deployment working after the thin shell is deployed.
- Mark any intentional simplification clearly in the README or related design docs.
