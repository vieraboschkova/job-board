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
  api/              Express routes and controllers
  application/      ingest and search use cases
  domain/           job models, review rules, repository interfaces
  infrastructure/   parsing helpers and concrete storage implementations
  config/           environment/configuration helpers
```

The main dependency direction is:

```
api -> application -> domain
infrastructure -> domain
```

The `domain` layer contains the business concepts: job models, review results, review rules, and repository interfaces. The review engine belongs there because it answers the core business question: whether a job should be approved for publication.

The `application` layer coordinates use cases, such as ingesting a batch of raw jobs or searching approved jobs. It should not know about Express request/response objects.

The `infrastructure` layer handles messy outside-world details, such as parsing salary/location fields from source JSON and storing jobs in an in-memory repository.

The `api` layer is HTTP glue. It receives requests, calls application services, and returns responses.

```

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
```
