# Frontend Design

## Stack

- React
- TypeScript
- Vite
- Material UI

## Structure

Recommended frontend structure:

```txt
client/
  src/
    main.tsx
    App.tsx
    api/
    common/
    components/
    pages/
    store/
    theme/
    types/
    tests/
```

## Main Page

Build a single approved-jobs search page.

The page should include:

- title/header
- title search input
- country filter
- sort select
- approved job count
- job list
- loading state
- error state
- empty state

## Demo Ingestion

No dedicated `/demo-ingestion` UI page. Reviewers ingest sample payloads via curl or Swagger UI at `/api/docs` using files under `sample-data/`. The approved jobs search page remains the only product UI surface.

## Components

Recommended components:

- `SearchToolbar`
- `CountryFilter`
- `SortSelect`
- `JobList`
- `JobCard`
- `EmptyState`

Use Material UI components such as `Container`, `Stack`, `TextField`, `Select`, `MenuItem`, `Card`, `Chip`, `Typography`, `Alert`, and `CircularProgress`.

## API Client

Create a small API wrapper for job search.

The UI should call:

```txt
GET /api/jobs/search?search=<text>&country=<country>&sort=<sort>
```

Ingestion is exercised via Swagger (`POST /api/ingest`) or curl against `sample-data/`, not a frontend form.

The API client should hide route construction from components.

## UI Behavior

- Search by job title.
- Filter by country.
- Sort by salary or posting date.
- Render approved jobs only.
- Keep controls usable on mobile and desktop.

## Visual Direction

The UI should feel like a polished internal recruiting/search tool:

- compact
- readable
- simple
- not marketing-heavy
- no oversized hero section

## Acceptance Criteria

- approved jobs render in a list
- search updates the list
- country filter updates the list
- sort selection updates the list
- empty and error states are clear
- layout remains usable on narrow screens

Use mui attributes for styling, if custom styles needed, create separate component.styles.ts file to use as styling wrapper.
