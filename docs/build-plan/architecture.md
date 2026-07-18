# Architecture

## Recommended Shape

Use a single Node.js/TypeScript service that exposes API routes and serves the built React frontend in production.

Local development should run the backend and Vite frontend separately. Production should run one Node process.

```txt
React UI
  -> API client
  -> Express routes
  -> workflow services
  -> ingestion / review / repository interfaces
  -> in-memory repositories for MVP
```

## Backend Boundaries

Keep the backend organized around four major layers:

- Domain: job models, review concepts, repository interfaces.
- Workflows: use cases and engines such as ingesting jobs, normalizing, reviewing, and job reading (search, get by id).
- Infrastructure: in-memory repositories, parsing helpers, language detection.
- API: Express routes and controllers.

Domain and workflow code should not depend on Express.

## Ingestion Boundary

Ingestion is a backend module, not a separate deployed service.

For the take-home version, ingestion runs in-process when `POST /api/ingest` is called.

The module should depend on interfaces:

- `JobNormalizer`
- `ReviewEngine`
- `JobPublisher`
- `JobRejector`

This keeps the extraction path clean. Later, the same ingestion service can be called from a queue consumer, worker process, cron job, or standalone service.

## Frontend Boundary

The frontend is a React/Vite app using Material UI.

It should call the API through a small API client module. Components should not know backend route details beyond the API client.

## Deployment Recommendation

Use Render first.

Render is the lowest-friction choice for a single Node service with a build command and start command.

Production behavior:

- build backend TypeScript
- build React frontend
- start Node server
- serve API from `/api/*`
- serve React static files for non-API routes

Fly.io with Docker is a good optional alternative if container parity becomes important.

## Intentional Simplifications

- In-memory storage instead of a database.
- Simple salary, location, and language parsing.
- No authentication for MVP endpoints.
- Optional rejection-log endpoint rather than a full admin UI.
