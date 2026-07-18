# Job Board

Job ingestion, review, and search system: normalize messy job JSON, approve or reject with explicit rules, then search and filter published jobs.

**Live app:** [https://job-board-46zj.onrender.com/](https://job-board-46zj.onrender.com/)  
**Swagger (live):** [https://job-board-46zj.onrender.com/api/docs](https://job-board-46zj.onrender.com/api/docs)

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

Production (after `npm run build`):

```bash
npm start
```

## Original Assignment Coverage

Maps to [docs/build-plan/original-task.md](docs/build-plan/original-task.md):

| Requirement                   | How this project delivers it                                                                                                                              |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Data modeling                 | Domain `Job`, `Salary`, `Location`, and enums under `server/src/domain/job/`                                                                              |
| Ingestion of messy JSON       | `POST /api/ingest` → normalizer + parsers; sample payloads in `server/src/tests/mock/`                                                                    |
| Review criteria               | Pluggable rules: title, location (remote or US/CA), full-time, salary (`> $100k` annual or `> $45/hr` USD), no staffing firm, English or French-in-Canada |
| Approve / reject with reasons | Review engine → publisher or rejector; rejection reasons stored and exposed via `GET /api/rejections`                                                     |
| Storage                       | In-memory published store (detail + dedupe), search index (`JobSummary`), rejected log                                                                    |
| UX                            | React UI: list, search by title/company, filter by country, sort by salary or posting date                                                                |
| Code organization             | Layered modules: `api` → `workflows` → `domain`; `infrastructure` → `domain`                                                                              |
| Flexible future rules         | `ReviewRule` interface and a composable `defaultRules` list                                                                                               |
| Testability                   | Vitest coverage for rules, workflows, repositories, and API                                                                                               |

Pipeline: **ingest → normalize → review → publish or reject → search UI**.

## Intentional Simplifications

- **Node.js / TypeScript** instead of the prompt’s “ideally Go / Typed Python” — same layered design, one language across API and React.
- **In-memory storage** (no database); approved/rejected/search data resets on process restart or redeploy.
- **In-process ingestion** (not a separate worker deploy); interfaces keep a later worker/queue extraction path open.
- **No authentication** on ingest or rejections (demo-friendly, not production-hardened).
- **Simple parsing** for location, salary, and language (comma-split locations, threshold salary checks).
- **Search** matches title or company (superset of “search by title”).
- Extra review rule `sourceDataRequired` so publish dedupe has a stable `sourceName` + `sourceId`.

## Deployment

Single Render Web Service (Node): build with `npm install && npm run build`, start with `npm start`. The Node process serves `/api/*` and the built React app.

|          |                                                                                              |
| -------- | -------------------------------------------------------------------------------------------- |
| Live URL | [https://job-board-46zj.onrender.com/](https://job-board-46zj.onrender.com/)                 |
| Swagger  | [https://job-board-46zj.onrender.com/api/docs](https://job-board-46zj.onrender.com/api/docs) |
| Health   | `GET /api/health`                                                                            |
| Env      | `NODE_ENV=production`; `PORT` from Render                                                    |

Because storage is in-memory, the job board is empty after a cold start or redeploy. Re-ingest sample data (local or live) to demo search. Ingest is publicly reachable for the take-home demo.

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

I went with a modular monolith on purpose. I wanted enough structure that normalization, review, and persistence stay testable and easy to separate later, without paying for a separately deployed ingestion service up front. `JobIngester` runs in-process today (via `JobIngestionService`) and depends on interfaces, so I can move the same workflow behind a worker or queue later if I need to.

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
- `infrastructure` — concrete adapters; right now in-memory published, search, and rejected repos
- `api` — HTTP glue: take the request, call a workflow, return the response

I left `config/` and `shared/` empty for now — reserved for config helpers and shared utilities when I need them.

### Clean Code, Clean Architecture, and DDD

I borrowed from Clean Code and Clean Architecture without turning them into ceremony: small modules, clear names, and a domain that doesn't know about Express or storage. From DDD I kept what helps — shared terms like `Job` and `ReviewRule`, pluggable review rules, repository interfaces — and skipped the heavy stuff (rich aggregates, domain events, multiple contexts). Jobs are simple data shapes; workflow engines own the behavior. That made the review rules easier to test and explain for this one use case.

## API

Interactive docs (Swagger UI): [http://localhost:3000/api/docs](http://localhost:3000/api/docs) locally, or [https://job-board-46zj.onrender.com/api/docs](https://job-board-46zj.onrender.com/api/docs) on the live deploy. OpenAPI is hand-maintained next to Joi for the MVP. The React client mirrors API types by hand today; for a production-ready setup I'd generate those types (and optionally the fetch client) from the OpenAPI document so server and UI stay in sync.

| Method | Path               | Description                                                                   |
| ------ | ------------------ | ----------------------------------------------------------------------------- |
| `GET`  | `/api/health`      | Health check via `HealthChecker` (`ok` / `degraded` → 200, `unhealthy` → 503) |
| `POST` | `/api/ingest`      | Ingest a batch of raw job postings                                            |
| `GET`  | `/api/jobs`        | List all published jobs (full store)                                          |
| `GET`  | `/api/jobs/search` | Search summaries: `search`, `country`, `sort` (`salary_*`, `postedAt_*`)      |
| `GET`  | `/api/jobs/:id`    | Published job detail                                                          |
| `GET`  | `/api/rejections`  | Rejected jobs with reasons                                                    |
| `GET`  | `/api/docs`        | Swagger UI                                                                    |
| `GET`  | `/api/docs.json`   | Raw OpenAPI document                                                          |

`POST /api/ingest` body:

```json
{
  "sourceName": "sample",
  "jobs": []
}
```

Successful responses return summary counts (`receivedCount`, `normalizedCount`, `approvedCount`, `rejectedCount`, `duplicatesCount`, `duplicates`, `errors`). Invalid bodies return `400` with `INVALID_REQUEST_BODY`. Unknown `/api/*` routes return `404` with `NOT_FOUND`. Unexpected failures return `500` with `INTERNAL_SERVER_ERROR`.

Request validation uses Joi middleware in the API layer; domain/workflow code stays free of Express and schema details.

### Sample data demo

Ready-to-post ingest payloads live under `server/src/tests/mock/`. Each file is a full `POST /api/ingest` body (~30% approved, rest rejected across all seven review rules, with mixed raw field shapes):

| File                                                                       | Jobs | Expected approved / rejected |
| -------------------------------------------------------------------------- | ---- | ---------------------------- |
| [`server/src/tests/mock/jobs-10.json`](server/src/tests/mock/jobs-10.json) | 10   | 3 / 7                        |
| [`server/src/tests/mock/jobs-20.json`](server/src/tests/mock/jobs-20.json) | 20   | 6 / 14                       |
| [`server/src/tests/mock/jobs-50.json`](server/src/tests/mock/jobs-50.json) | 50   | 15 / 35                      |

**Local** ingest via curl (or paste the same JSON into Swagger UI at `/api/docs`):

```bash
curl -X POST http://localhost:3000/api/ingest \
  -H "Content-Type: application/json" \
  --data @server/src/tests/mock/jobs-10.json

curl -X POST http://localhost:3000/api/ingest \
  -H "Content-Type: application/json" \
  --data @server/src/tests/mock/jobs-20.json

curl -X POST http://localhost:3000/api/ingest \
  -H "Content-Type: application/json" \
  --data @server/src/tests/mock/jobs-50.json
```

Then search approved jobs:

```bash
curl "http://localhost:3000/api/jobs/search?search=engineer&sort=salary_desc"
curl "http://localhost:3000/api/jobs/search?country=CA&sort=postedAt_desc"
```

**Live** (same payloads; re-ingest after a cold start or redeploy):

```bash
curl -X POST https://job-board-46zj.onrender.com/api/ingest \
  -H "Content-Type: application/json" \
  --data @server/src/tests/mock/jobs-10.json

curl "https://job-board-46zj.onrender.com/api/jobs/search?search=engineer&sort=salary_desc"
```

## Backend Flows

Ingestion flow:

```txt
POST /api/ingest
  -> validateRequestBody (Joi)
  -> api controller
  -> JobIngestionService
  -> JobNormalizer
  -> ReviewEngine
  -> JobPublisher or JobRejector
```

The ingestion service receives raw job postings, normalizes each posting into the internal model, evaluates it with the review engine, then publishes approved jobs or rejects them with reasons.

Approved jobs are deduplicated before publish using `sourceName` + `sourceId` (jobs missing either are rejected by the `missing_source_data` review rule, so they never reach publish). A match against an already published job is skipped (not stored again). The ingest response includes `duplicatesCount` and a `duplicates` list of `{ sourceName, id, sourceId }`. When any duplicates occur, the server also logs that list once for the batch.

Dedupe runs only against the published store. On a real create, publish dual-writes the full `PublishedJob` and a `JobSummary` into the search store. If the search write fails after published save, the service logs the job ids and rethrows (no sync/repair worker in the take-home). A later re-ingest of that job is treated as a duplicate and will not backfill the search index, so the job can remain searchable only via detail/`GET /api/jobs` until something else reindexes it.

Target search flow:

```txt
GET /api/jobs/search?search=engineer&country=US&sort=salary_desc
  -> api controller
  -> PublishedJobsReaderService
  -> JobSearchRepository (JobSummary index)
```

Detail and list-all still read the published store:

```txt
GET /api/jobs/{id}  -> PublishedJobRepository
GET /api/jobs       -> PublishedJobRepository
```

The job reader normalizes the search query, then retrieves summaries from the search repository (title/company filter, country filter, salary or posted-date sort).

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
JobPublisher  JobRejector
   |         |
   +----+    v
   |    |  RejectedJobRepository
   v    v
PublishedJobRepository   JobSearchRepository
(full document + dedupe) (JobSummary index)
```

## Expandability and Scalability

Right now one API call sends a JSON batch into `JobIngester`. If this grew, I'd add more ways _in_ and more capacity _around_ that same core — I wouldn't rewrite normalize → review → store.

Deduping checks for an existing published job, then saves if none is found. That is fine for one request at a time. Two ingest requests running at the same moment can both miss the check and both save, so you can still get a duplicate. A real system would need a unique constraint (or similar) in the database so the store itself rejects the second write.

Publish dual-writes the search summary after the published save. For the take-home, a failed search write is logged and the request fails — there is no automatic reindex. In production I'd treat published as source of truth and fix drift with an outbox/event after commit, an async indexer with retries, and/or periodic reindex/backfill into OpenSearch/Elasticsearch (using job `id` as the document id so upserts stay idempotent).

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

1. **Now:** filter and sort in `JobSearchRepository` over slim `JobSummary` documents (in-memory stand-in for a search index).
2. **Later:** swap the in-memory adapter for OpenSearch/Elasticsearch behind the same `JobSearchRepository` interface; keep `GET /api/jobs/search` unchanged.

### Separation

I'd only split something out when it needs its own scale, schedule, or failure mode:

| Piece                     | Keep in the API app?                               | I'd make it independent when…                                                  |
| ------------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------ |
| Job search / UI API       | Yes (start here)                                   | Reads dominate and I want to scale them alone                                  |
| Ingestion worker          | Extract to a Node worker                           | Batches are large or slow (worker runs the same `JobIngester`)                 |
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

- **`POST /api/ingest` (what I'd start with):** something (crawler, ATS webhook, script) POSTs a batch of raw jobs. The API runs `JobIngester` in-process. Simple, and what this take-home already aims at.
- **Node worker (when ingest gets heavy):** If batches got big or slow, I'd move the heavy work off the request path — e.g. accept the batch quickly, then let a worker run `JobIngester` so the API stays responsive.
