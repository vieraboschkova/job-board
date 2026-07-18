import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { fetchJobs } from "../api/jobsApi";
import { getErrorMessage } from "../common/utils/get-error-message";
import { EmptyState } from "../components/EmptyState";
import { JobList } from "../components/JobList";
import { SearchToolbar } from "../components/SearchToolbar";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import type { CountryCode, JobSort } from "../types/job";

const SEARCH_DEBOUNCE_MS = 300;

export function JobsSearchPage() {
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState<"" | CountryCode>("");
  const [sort, setSort] = useState<"" | JobSort>("");
  const debouncedSearch = useDebouncedValue(search, SEARCH_DEBOUNCE_MS);

  const jobsQuery = useQuery({
    queryKey: ["jobs", { search: debouncedSearch, country, sort }],
    queryFn: () =>
      fetchJobs({
        search: debouncedSearch,
        country: country || undefined,
        sort: sort || undefined,
      }),
    placeholderData: keepPreviousData,
  });

  return (
    <Stack spacing={3}>
      <Stack spacing={0.5}>
        <Typography component="h1" variant="h4">
          Job Board
        </Typography>
        <Typography color="text.secondary">
          Search approved jobs by title or company, filter by country, and sort
          results.
        </Typography>
      </Stack>

      <SearchToolbar
        search={search}
        country={country}
        sort={sort}
        onSearchChange={setSearch}
        onCountryChange={setCountry}
        onSortChange={setSort}
      />

      {jobsQuery.isPending && (
        <Stack direction="row" spacing={1} alignItems="center">
          <CircularProgress size={24} />
          <Typography color="text.secondary">Loading jobs…</Typography>
        </Stack>
      )}

      {jobsQuery.isError && (
        <Alert severity="error">{getErrorMessage(jobsQuery.error)}</Alert>
      )}

      {jobsQuery.isSuccess && (
        <Stack spacing={2}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2" color="text.secondary">
              {jobsQuery.data.length}{" "}
              {jobsQuery.data.length === 1 ? "job" : "jobs"} found
            </Typography>
            {jobsQuery.isFetching && (
              <CircularProgress size={14} aria-label="Updating results" />
            )}
          </Stack>
          {jobsQuery.data.length === 0 ? (
            <EmptyState />
          ) : (
            <JobList jobs={jobsQuery.data} />
          )}
        </Stack>
      )}
    </Stack>
  );
}
