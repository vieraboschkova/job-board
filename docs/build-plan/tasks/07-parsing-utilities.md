# Task 07: Implement Parsing Utilities

Status: MVP

## Purpose

Isolate messy input handling in focused, testable utilities.

## Implementation Details

- Implement salary parsing.
- Implement location parsing.
- Implement employment type parsing.
- Implement posted date parsing.
- Implement lightweight language detection.
- Return normalized values or unknown/null results instead of throwing for malformed input.

## Files And Modules Touched

- `server/src/infrastructure/parsing/`
- `server/src/infrastructure/language/`
- backend tests

## Acceptance Criteria

- Numeric salary is treated as annual salary.
- Salary objects with min/max/currency/period are handled.
- Salary strings like `$120,000`, `$50/hour`, and `100k-140k` are handled.
- Location strings, objects, `Remote`, and null are handled.
- Employment type variants normalize to known values.
- Language detection can distinguish common English and French descriptions well enough for MVP.

## Verification Steps

```bash
npm test -w server
npm run typecheck -w server
```

## Prerequisites

- Task 05 complete.

## Handoff Notes

After this task, run Task 08 to wire these utilities into the job normalizer.
