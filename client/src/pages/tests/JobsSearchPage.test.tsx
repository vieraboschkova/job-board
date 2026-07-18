import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "@mui/material/styles";
import { QueryClientProvider } from "@tanstack/react-query";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Job, JobSummary } from "../../types/job";
import { createQueryClient } from "../../query/query-client";
import { theme } from "../../theme/theme";
import { JobsSearchPage } from "../JobsSearchPage";

const fetchJobs = vi.fn();
const fetchJobById = vi.fn();

vi.mock("../../api/jobsApi", () => ({
  fetchJobs: (...args: unknown[]) => fetchJobs(...args),
  fetchJobById: (...args: unknown[]) => fetchJobById(...args),
}));

vi.mock("../../hooks/useDebouncedValue", () => ({
  useDebouncedValue: <T,>(value: T) => value,
}));

function renderPage() {
  return render(
    <QueryClientProvider client={createQueryClient()}>
      <ThemeProvider theme={theme}>
        <JobsSearchPage />
      </ThemeProvider>
    </QueryClientProvider>,
  );
}

function makeSummary(overrides: Partial<JobSummary> = {}): JobSummary {
  return {
    id: "job-1",
    title: "Backend Engineer",
    company: "NextGen Systems",
    location: { country: "US", city: "Austin", remote: false },
    salary: { min: 145000, currency: "USD", unit: "annual" },
    employmentType: "full_time",
    postedAt: "2023-10-03T00:00:00.000Z",
    ...overrides,
  };
}

function makeJob(overrides: Partial<Job> = {}): Job {
  return {
    ...makeSummary(),
    description: "Build APIs",
    language: "english",
    companyType: "direct_employer",
    sourceName: "example-feed",
    sourceId: "src-1",
    createdAt: "2023-10-03T00:00:00.000Z",
    ...overrides,
  };
}

describe("JobsSearchPage", () => {
  beforeEach(() => {
    fetchJobs.mockReset();
    fetchJobById.mockReset();
  });

  it("shows loading then job cards", async () => {
    fetchJobs.mockResolvedValue([makeSummary()]);

    renderPage();

    expect(screen.getByText(/loading jobs/i)).toBeInTheDocument();

    expect(
      await screen.findByRole("heading", { name: "Backend Engineer" }),
    ).toBeInTheDocument();
    expect(screen.getByText("1 job found")).toBeInTheDocument();
    expect(screen.getByText("NextGen Systems")).toBeInTheDocument();
  });

  it("shows empty state when no jobs match", async () => {
    fetchJobs.mockResolvedValue([]);

    renderPage();

    expect(
      await screen.findByText(/no jobs match your search/i),
    ).toBeInTheDocument();
    expect(screen.getByText("0 jobs found")).toBeInTheDocument();
  });

  it("shows error state when the API fails", async () => {
    fetchJobs.mockRejectedValue(new Error("Network down"));

    renderPage();

    expect(await screen.findByText("Network down")).toBeInTheDocument();
  });

  it("refetches when search, country, and sort change", async () => {
    const user = userEvent.setup();
    fetchJobs.mockResolvedValue([makeSummary()]);

    renderPage();
    await screen.findByText("1 job found");
    fetchJobs.mockClear();

    await user.type(
      screen.getByRole("textbox", { name: /search title or company/i }),
      "eng",
    );

    await waitFor(() => {
      expect(fetchJobs).toHaveBeenCalledWith({
        search: "eng",
        country: undefined,
        sort: undefined,
      });
    });

    await user.click(screen.getByRole("combobox", { name: "Country" }));
    await user.click(await screen.findByRole("option", { name: "Canada" }));

    await waitFor(() => {
      expect(fetchJobs).toHaveBeenLastCalledWith({
        search: "eng",
        country: "CA",
        sort: undefined,
      });
    });

    await user.click(screen.getByRole("combobox", { name: "Sort" }));
    await user.click(
      await screen.findByRole("option", { name: "Salary (high to low)" }),
    );

    await waitFor(() => {
      expect(fetchJobs).toHaveBeenLastCalledWith({
        search: "eng",
        country: "CA",
        sort: "salary_desc",
      });
    });
  });

  it("clears search and country filters", async () => {
    const user = userEvent.setup();
    fetchJobs.mockResolvedValue([makeSummary()]);

    renderPage();
    await screen.findByText("1 job found");
    fetchJobs.mockClear();

    fireEvent.change(
      screen.getByRole("textbox", { name: /search title or company/i }),
      { target: { value: "eng" } },
    );

    await waitFor(() => {
      expect(fetchJobs).toHaveBeenCalledWith({
        search: "eng",
        country: undefined,
        sort: undefined,
      });
    });

    await user.click(screen.getByRole("combobox", { name: "Country" }));
    await user.click(await screen.findByRole("option", { name: "Canada" }));

    await waitFor(() => {
      expect(fetchJobs).toHaveBeenLastCalledWith({
        search: "eng",
        country: "CA",
        sort: undefined,
      });
    });
    fetchJobs.mockClear();

    await user.click(screen.getByRole("button", { name: /clear search/i }));

    await waitFor(() => {
      expect(fetchJobs).toHaveBeenCalledWith({
        search: "",
        country: "CA",
        sort: undefined,
      });
    });
    expect(
      screen.getByRole("textbox", { name: /search title or company/i }),
    ).toHaveValue("");
    fetchJobs.mockClear();

    await user.click(screen.getByRole("button", { name: /clear country/i }));

    await waitFor(() => {
      expect(fetchJobs).toHaveBeenCalledWith({
        search: "",
        country: undefined,
        sort: undefined,
      });
    });
  });

  it("shows a spinner while keeping previous results during refetch", async () => {
    fetchJobs.mockResolvedValue([makeSummary()]);

    renderPage();
    await screen.findByText("1 job found");

    let resolveRefetch: (jobs: JobSummary[]) => void = () => undefined;
    fetchJobs.mockImplementation(
      () =>
        new Promise<JobSummary[]>((resolve) => {
          resolveRefetch = resolve;
        }),
    );

    fireEvent.change(
      screen.getByRole("textbox", { name: /search title or company/i }),
      { target: { value: "eng" } },
    );

    expect(
      await screen.findByRole("progressbar", { name: /updating results/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("1 job found")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Backend Engineer" }),
    ).toBeInTheDocument();

    resolveRefetch([
      makeSummary({ id: "job-2", title: "Platform Engineer" }),
    ]);

    expect(
      await screen.findByRole("heading", { name: "Platform Engineer" }),
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(
        screen.queryByRole("progressbar", { name: /updating results/i }),
      ).not.toBeInTheDocument();
    });
  });

  it("fetches job by id when a card is clicked", async () => {
    const user = userEvent.setup();
    fetchJobs.mockResolvedValue([makeSummary()]);
    fetchJobById.mockResolvedValue(makeJob());

    renderPage();
    await screen.findByText("1 job found");

    await user.click(
      screen.getByRole("button", {
        name: /view details for backend engineer/i,
      }),
    );

    await waitFor(() => {
      expect(fetchJobById).toHaveBeenCalledWith("job-1");
    });

    const dialog = await screen.findByRole("dialog");
    expect(dialog).toHaveTextContent("Build APIs");
    expect(dialog).toHaveTextContent("Direct employer");
    expect(dialog).toHaveTextContent("English");
    expect(dialog).toHaveTextContent("example-feed");
    expect(dialog).toHaveTextContent("src-1");
    expect(dialog).toHaveTextContent("job-1");

    await user.click(screen.getByRole("button", { name: /close/i }));
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });
});
