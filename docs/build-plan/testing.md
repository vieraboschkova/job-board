# Testing Strategy

## Backend Unit Tests

Test domain and parsing logic without Express.

Required areas:

- salary parser
- location parser
- employment type parser
- date parser
- language heuristic
- review rules
- review engine
- job normalizer
- in-memory repositories

## Backend Integration Tests

Use API-level tests for:

- `GET /api/health`
- `POST /api/ingest`
- `GET /api/jobs`
- optional `GET /api/rejections`

Recommended tools:

- Vitest
- Supertest

## Frontend Tests

Use React Testing Library with Vitest.

Test:

- job list rendering
- search controls
- country filter
- sort select
- loading state
- error state
- empty state

## Required Messy Input Scenarios

Cover these cases in fixtures:

- missing title
- empty title
- numeric annual salary
- object salary
- hourly salary string
- salary range string
- missing salary
- location string
- location object
- `Remote`
- null location
- full-time variants
- staffing firm company names
- English description
- French Canadian description
- unknown language
- malformed posted date

## Review Rule Scenarios

At minimum, test:

- a fully approved job
- title rejection
- location rejection
- employment type rejection
- salary rejection
- staffing firm rejection
- language rejection
- job with multiple rejection reasons

## Verification Commands

Expected commands after scaffolding:

```bash
npm run typecheck
npm test
npm run build
```

Before a deployment handoff, verify:

```bash
npm run build
npm start
```
