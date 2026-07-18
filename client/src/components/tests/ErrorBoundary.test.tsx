import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ErrorBoundary } from "../ErrorBoundary";

function ThrowingChild(): never {
  throw new Error("Render boom");
}

describe("ErrorBoundary", () => {
  it("renders fallback UI when a child throws", () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);

    render(
      <ErrorBoundary>
        <ThrowingChild />
      </ErrorBoundary>,
    );

    expect(
      screen.getByRole("heading", { name: /something went wrong/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Render boom")).toBeInTheDocument();

    consoleError.mockRestore();
  });

  it("remounts children when Try again is clicked after a transient error", async () => {
    const user = userEvent.setup();
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    // Keep throwing until the test flips this (do not mutate inside render — React 19 may recover).
    let shouldThrow = true;

    function FlakyChild() {
      if (shouldThrow) {
        throw new Error("Transient boom");
      }
      return <p>Recovered</p>;
    }

    render(
      <ErrorBoundary>
        <FlakyChild />
      </ErrorBoundary>,
    );

    expect(screen.getByText("Transient boom")).toBeInTheDocument();

    shouldThrow = false;
    await user.click(screen.getByRole("button", { name: /try again/i }));

    expect(await screen.findByText("Recovered")).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: /something went wrong/i }),
    ).not.toBeInTheDocument();

    consoleError.mockRestore();
  });
});
