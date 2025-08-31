import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AllSummaries from "./AllSummaries";

describe("AllSummaries", () => {
  it("renders nothing when snippets is undefined", () => {
    const { container } = render(<AllSummaries snippets={undefined} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders a grid of summaries", () => {
    const snippets = [
      {
        id: "1",
        text: "Original text 1",
        summary: "Summary 1",
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        text: "Original text 2",
        summary: "Summary 2",
        createdAt: new Date().toISOString(),
      },
    ];

    render(<AllSummaries snippets={snippets} />);

    expect(screen.getByText("Summary 1")).toBeInTheDocument();
    expect(screen.getByText("Summary 2")).toBeInTheDocument();
  });

  it("applies correct grid styling", () => {
    const snippets = [
      {
        id: "1",
        text: "Original text 1",
        summary: "Summary 1",
        createdAt: new Date().toISOString(),
      },
    ];

    const { container } = render(<AllSummaries snippets={snippets} />);
    const gridContainer = container.firstChild;

    expect(gridContainer).toHaveClass("grid", "grid-cols-2", "gap-4", "p-6");
  });
});
