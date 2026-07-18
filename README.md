# Job Board

Job ingestion, review, and search system.

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

## Folder Structure

```txt
job-board/
  client/                 React frontend (Vite, TypeScript, Material UI)
  server/                 Node.js Express backend (TypeScript)
  docs/build-plan/        Design docs and task breakdown
  AGENTS.md               Project status and agent working notes
  CLAUDE.md               Local development guide
```

Backend layout:

```txt
server/src/
  api/                    Routes, controllers, Joi middleware, constants, Swagger
  workflows/              Ingest, normalize, review, and search use cases
  domain/                 Job models, review types/enums, repository interfaces
  infrastructure/         Concrete storage implementations (in-memory repos)
  config/                 Environment/configuration helpers (reserved for future use)
  shared/                 Cross-cutting utilities and errors (reserved for future use)
```

## Architecture Choice

I went with a modular monolith on purpose. I wanted enough structure that normalization, review, and persistence stay testable and easy to separate later, without paying for a separately deployed ingestion service up front. `JobIngestionService` runs in-process today and depends on interfaces, so I can move the same workflow behind a worker or queue later if I need to.

The backend is a lightweight layered setup — middle ground on purpose.

I didn't put everything in routes or a few top-level files. That would have been faster at first, but this problem is business-heavy: messy job input, several review rules, approved vs rejected storage, and search. Separating those concerns makes the logic easier to test and explain.

I also didn't go full platform: no separately deployed ingestion service, queue, DI framework, database layer, or heavy module system. Ingestion is its own in-process module with clear interfaces. For this take-home, storage stays in memory. Clear boundaries, low ops cost.

Dependency direction:

```txt
api -> workflows -> domain
infrastructure -> domain
```

- `domain` — business contracts only: job models, review types/enums, repository/service interfaces
- `workflows` — use cases and engines (normalizer, review rules, ingestion). Parsing and language detection live under normalization. No Express request/response objects here
- `infrastructure` — concrete adapters; right now in-memory published/rejected repos
- `api` — HTTP glue: take the request, call a workflow, return the response

I left `config/` and `shared/` empty for now — reserved for config helpers and shared utilities when I need them.

### Clean Code, Clean Architecture, and DDD

I borrowed from Clean Code and Clean Architecture without turning them into ceremony: small modules, clear names, and a domain that doesn't know about Express or storage. From DDD I kept what helps — shared terms like `Job` and `ReviewRule`, pluggable review rules, repository interfaces — and skipped the heavy stuff (rich aggregates, domain events, multiple contexts). Jobs are simple data shapes; workflow engines own the behavior. That made the review rules easier to test and explain for this one use case.

## API

Interactive docs (Swagger UI): [http://localhost:3000/api/docs](http://localhost:3000/api/docs) when the server is running. OpenAPI is hand-maintained next to Joi for the MVP.

| Method | Path             | Description                                                                   |
| ------ | ---------------- | ----------------------------------------------------------------------------- |
| `GET`  | `/api/health`    | Health check via `HealthChecker` (`ok` / `degraded` → 200, `unhealthy` → 503) |
| `POST` | `/api/ingest`    | Ingest a batch of raw job postings                                            |
| `GET`  | `/api/docs`      | Swagger UI                                                                    |
| `GET`  | `/api/docs.json` | Raw OpenAPI document                                                          |

`POST /api/ingest` body:

```json
{
  "sourceName": "sample",
  "jobs": []
}
```

Successful responses return summary counts (`receivedCount`, `normalizedCount`, `approvedCount`, `rejectedCount`, `errors`). Invalid bodies return `400` with `INVALID_REQUEST_BODY`. Unknown `/api/*` routes return `404` with `NOT_FOUND`. Unexpected failures return `500` with `INTERNAL_SERVER_ERROR`.

Request validation uses Joi middleware in the API layer; domain/workflow code stays free of Express and schema details.

## Backend Flows

Ingestion flow:

```txt
POST /api/ingest
  -> validateRequestBody (Joi)
  -> api controller
  -> JobIngestionService
  -> JobNormalizer
  -> ReviewEngine
  -> PublishedJobRepository or RejectedJobRepository
```

The ingestion service receives raw job postings, normalizes each posting into the internal model, evaluates it with the review engine, stores approved jobs, and logs rejected jobs with reasons.

Target search flow:

```txt
GET /api/jobs?search=engineer&country=US&sort=salary_desc
  -> api controller
  -> JobSearchService
  -> PublishedJobRepository
```

The search service receives a normalized search query, applies defaults or validation, retrieves approved jobs through the repository interface, and returns jobs filtered by title, filtered by country, and sorted by salary or posting date.

## Flow

```txt
Raw job / Ingestion
        |
        v
  Normalization
        |
        v
     Review
        |
   +----+----+
   |         |
   v         v
PublishedJob  RejectedJob
   |         |
   v         v
PublishedJob  RejectedJob
Repository    Repository
```

## Expandability and Scalability

Right now one API call sends a JSON batch into `JobIngestionService`. If this grew, I'd add more ways _in_ and more capacity _around_ that same core — I wouldn't rewrite normalize → review → store.

### Adapters

I'd keep source-specific code in `infrastructure`, not in workflows. Each source gets a small mapper that outputs `RawJobPosting[]` and a `sourceName`, then calls ingest.

For example:

```txt
server/src/infrastructure/sources/
  greenhouse/     # ATS webhook payload -> RawJobPosting[]
  lever/          # ATS webhook payload -> RawJobPosting[]
  workday/        # ATS export / API -> RawJobPosting[]
  partner-feed/   # nightly S3/CSV/JSON drop -> RawJobPosting[]
  crawler-ingest/ # optional: accept already-scraped JSON from the crawler service
```

ATS webhooks could land under `api/routes` (e.g. `POST /api/webhooks/greenhouse`).

I'd make the crawler a **completely separate service** — own deploy, schedule, browsers/proxies, retries. It scrapes and emits raw job JSON. This app only receives that payload (queue message or `POST /api/ingest`) and runs the pipeline. I wouldn't put review rules in the crawler.

### Storage

In-memory is fine for the take-home. For real volume, I'd move durable data to a database:

| Data                                         | Where I'd put it                                 | Why                                                    |
| -------------------------------------------- | ------------------------------------------------ | ------------------------------------------------------ |
| Published jobs                               | Postgres (or similar)                            | Durable list for the job board                         |
| Rejected jobs + reasons                      | Postgres                                         | Audit / ops review                                     |
| Raw source payloads                          | S3 or a raw-events table                         | Debug bad mappings without bloating the main job table |
| Search fields (title, country, salary, date) | DB indexes first; OpenSearch/Elasticsearch later | Fast filter/sort at scale                              |

I'd keep the messy raw blob off the hot search path — store the normalized `Job`, and maybe a pointer back to the raw payload.

### Search

1. **Now / soon:** filter and sort in `PublishedJobRepository` (in-memory or SQL `WHERE` / `ORDER BY`).
2. **Later:** if volume or query complexity grows, sync published jobs into a search index and keep `GET /api/jobs` talking to a search adapter behind the same API.

### Separation

I'd only split something out when it needs its own scale, schedule, or failure mode:

| Piece                     | Keep in the API app?                               | I'd make it independent when…                                                  |
| ------------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------ |
| Job search / UI API       | Yes (start here)                                   | Reads dominate and I want to scale them alone                                  |
| Ingestion worker          | Extract to a Node worker                           | Batches are large or slow (worker runs the same `JobIngestionService`)         |
| Crawler                   | No — separate service from day one of that feature | Own deploy: browsers, proxies, schedules, retries; pushes raw jobs into ingest |
| ATS webhooks              | Thin route in the API, or a small ingest gateway   | Inbound spikes, or I need isolated auth/rate limits                            |
| Review rules / normalizer | Shared library or same worker package              | Almost never their own service — they _are_ the core pipeline                  |

My rule of thumb: **one shared ingest core**; many thin adapters and workers around it.

### Target architecture flow

How I'd expect this to look if it grew beyond this task:

```txt
                    +------------------+
                    | Crawler service  |  (separate deploy)
                    | scrape sites     |
                    +--------+---------+
                             | raw JSON
                             v
  ATS webhooks ---------> +--+------------------+     +----------------+
  (Greenhouse, etc.)      | POST /api/ingest    | --> | Node worker    |
  Partner feed / upload ->| or hand off to      |     | JobIngestion   |
                          | a Node worker       |     | Service        |
                          +----------+----------+     +--------+-------+
                                                              |
                                              normalize -> review
                                                              |
                                              +---------------+---------------+
                                              |                               |
                                              v                               v
                                    +-------------------+           +------------------+
                                    | Postgres          |           | Postgres         |
                                    | published jobs    |           | rejected jobs    |
                                    +---------+---------+           +------------------+
                                              |
                                              | sync
                                              v
                                    +-------------------+     +-------------+
                                    | Search index      | <-- | React UI    |
                                    | (or SQL indexes)  |     | GET /api/jobs|
                                    +-------------------+     +-------------+

  Raw payloads (optional): crawler / ATS -> S3 or raw-events table
```

**`POST /api/ingest` vs a Node worker — same core, different caller:**

- **`POST /api/ingest` (what I'd start with):** something (crawler, ATS webhook, script) POSTs a batch of raw jobs. The API runs `JobIngestionService` in-process. Simple, and what this take-home already aims at.
- **Node worker (when ingest gets heavy):** If batches got big or slow, I'd move the heavy work off the request path — e.g. accept the batch quickly, then let a worker run `JobIngestionService` so the API stays responsive.
