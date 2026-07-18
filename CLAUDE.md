---

name: CLAUDE.md
description: This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.
metadata:
type: project

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

- `nvm use`: Use Node 22 or newer.
- `npm install`: Install dependencies.
- `npm run dev`: Start the development server.
- `npm run typecheck`: Check TypeScript types.
- `npm run build`: Build the application.
- `npm test`: Run tests.
- `npm start`: Start the application.

## Code Architecture

The backend is built with a lightweight layered structure:

```
server/src/
  api/              Express routes, controllers, Joi validation middleware, Swagger
  domain/           types, enums, and repository interfaces
  workflows/        normalization, review engine, and related implementations, ingest and job-reader
  infrastructure/   parsing helpers and concrete storage implementations
  config/           environment/configuration helpers
```

The main dependency direction is:

```
api -> workflows -> domain
infrastructure -> domain
```

The `domain` layer contains business contracts only: job models, review types/enums, and repository interfaces.

The `workflows` layer holds use cases and engines such as the job normalizer, review rule engine, and ingestion service. It should not know about Express request/response objects.

The `infrastructure` layer handles messy outside-world details, such as parsing salary/location fields from source JSON and storing jobs in an in-memory repository.

The `api` layer is HTTP glue. It validates requests with Joi middleware, calls workflow services, and returns responses. Swagger UI is available at `/api/docs`.

## Useful Root Scripts

- `npm run typecheck`: Check TypeScript types.
- `npm run build`: Build the application.
- `npm test`: Run tests.
- `npm start`: Start the application.

## Key Files and Directives

### Important Parts from README.md:

- Setup instructions: Use Node 22 or newer, install dependencies with `npm install`, and start the server with `npm run dev`.
- Architecture description: Layered structure with clear boundaries between layers.
- Additional information: Any other relevant details can be added here.
- API docs: Swagger UI at `/api/docs`; request validation uses Joi middleware.
