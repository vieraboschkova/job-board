# Task 13: Build Frontend Job Search UI

Status: MVP

## Purpose

Create the user-facing approved jobs search experience.

## Implementation Details

- Create a jobs API client.
- Fetch approved jobs from `GET /api/jobs`.
- Add title search input.
- Add country filter.
- Add sort select.
- Render job cards.
- Add loading, error, and empty states.
- Use TanStack Query for fetch lifecycle (loading, success, error) for jobs search, job detail, and health check.
- Add an `ErrorBoundary` around the app shell for unexpected render errors.
- Normalize expected API failures through `client/src/api/client.ts` and `ApiError` so pages show readable messages.
- Keep the layout responsive and polished.

## Files And Modules Touched

- `client/src/App.tsx`
- `client/src/api/jobsApi.ts`
- `client/src/api/client.ts`
- `client/src/components/`
- `client/src/components/ErrorBoundary.tsx`
- `client/src/query/query-client.ts`
- `client/src/hooks/useDebouncedValue.ts`
- `client/src/types/`
- `client/src/theme/`
- frontend tests

## Acceptance Criteria

- Approved jobs display in a list.
- Search control updates results.
- Country filter updates results.
- Sort select updates results.
- Empty state appears when no jobs match.
- Error state appears when API call fails.
- Unexpected render errors are caught by `ErrorBoundary` and show a fallback UI instead of a blank page.
- UI is usable on desktop and mobile widths.

## Verification Steps

```bash
npm test -w client
npm run typecheck -w client
npm run dev
```

Manually test search, filter, sort, loading, empty, and API error states. Confirm the error boundary fallback appears if a component throws during render.

## Prerequisites

- Task 12 complete.

## Handoff Notes

After this task, run Task 14 to add sample data and a smooth demo flow.
