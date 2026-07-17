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

## Demo Ingestion Page

Add a secondary page at `/demo-ingestion` for interview/demo use.

This page should let the reviewer exercise ingestion without using curl.

It should include:

- source name input
- sample scenario selector
- editable JSON payload field
- submit button
- reset-to-sample button
- ingestion summary result
- link back to the approved jobs page

Keep this page clearly secondary. The approved jobs search page remains the primary product experience.

## Components

Recommended components:

- `SearchToolbar`
- `CountryFilter`
- `SortSelect`
- `JobList`
- `JobCard`
- `EmptyState`
- `DemoIngestionForm`
- `IngestionSummary`

Use Material UI components such as `Container`, `Stack`, `TextField`, `Select`, `MenuItem`, `Card`, `Chip`, `Typography`, `Alert`, and `CircularProgress`.

## API Client

Create a small API wrapper for job search.

The UI should call:

```txt
GET /api/jobs?search=<text>&country=<country>&sort=<sort>
```

The demo ingestion page should call:

```txt
POST /api/ingest
```

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
- demo ingestion page can submit sample or custom payloads
- demo ingestion page displays review/rejection counts after submit

Use mui attributes for styling, if custom styles needed, create separate component.styles.ts file to use as styling wrapper.
