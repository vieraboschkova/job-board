# Job Board

Job ingestion, approval, and search system.

https://job-board-46zj.onrender.com/

## Quickstart

Use Node 22 or newer:

```bash
nvm use
npm install
npm run dev
```

Useful root scripts:

```bash
npm run typecheck
npm run build
npm test
npm start
```

## Architecture Choice

The backend is being built toward a lightweight layered structure:

```txt
server/src/
  api/              Express routes and controllers
  application/      ingest and search use cases
  domain/           job models, approval rules, repository interfaces
  infrastructure/   parsing helpers and concrete storage implementations
  config/           environment/configuration helpers
```

This is intentionally a middle-ground design. At the current scaffold stage, these folders are the intended boundaries for the implementation work that follows.

It is not the simplest possible structure, where everything lives in routes or a handful of top-level files. That approach would be quick at first, but the core requirements in this project are business-heavy: normalize messy job input, apply multiple approval criteria, store approved jobs, log rejected jobs, and support search. Keeping those concerns separated makes the approval and ingestion logic easier to test and explain.

It is also not the most complex option. There is no separate ingestion service, queue, dependency injection framework, database layer, or framework-specific module system. For this task, ingestion runs in-process and storage can stay in memory. The structure is meant to show clear boundaries without adding operational complexity.

The main dependency direction is:

```txt
api -> application -> domain
infrastructure -> domain
```

The `domain` layer contains the business concepts: job models, approval results, approval rules, and repository interfaces. The approval engine belongs there because it answers the core business question: whether a job should be approved for publication.

The `application` layer coordinates use cases, such as ingesting a batch of raw jobs or searching approved jobs. It should not know about Express request/response objects.

The `infrastructure` layer handles messy outside-world details, such as parsing salary/location fields from source JSON and storing jobs in an in-memory repository.

The `api` layer is HTTP glue. It receives requests, calls application services, and returns responses.

This keeps the system small enough for the assignment while leaving a clean path to extract ingestion into a worker, queue consumer, or standalone service later.

## Backend Flows

Ingestion flow:

```txt
POST /api/ingest
  -> api controller
  -> JobIngestionService
  -> JobNormalizer
  -> ApprovalEngine
  -> JobRepository or RejectedJobRepository
```

The ingestion service receives raw job postings, normalizes each posting into the internal model, evaluates it with the approval engine, stores approved jobs, and logs rejected jobs with reasons.

Search flow:

```txt
GET /api/jobs?search=engineer&country=US&sort=salary_desc
  -> api controller
  -> JobSearchService
  -> JobRepository
```

The search service receives a normalized search query, applies defaults or validation, retrieves approved jobs through the repository interface, and returns jobs filtered by title, filtered by country, and sorted by salary or posting date.
