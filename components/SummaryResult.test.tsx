import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import SummaryResult from "./SummaryResult";

describe("SummaryResult", () => {
  it("renders default text when result is undefined", () => {
    render(<SummaryResult result={undefined} />);
    expect(screen.getByText("Summary")).toBeInTheDocument();
  });

  it("renders sanitized summary from result", () => {
    const result = {
      id: "1",
      text: "Original text",
      summary: "This is a test summary",
      createdAt: new Date().toISOString(),
    };

    render(<SummaryResult result={result} />);
    expect(screen.getByText("This is a test summary")).toBeInTheDocument();
  });

  it("sanitizes HTML in summary content", () => {
    const result = {
      id: "1",
      text: "Original text",
      summary:
        '<script>alert("xss")</script>Safe content<img src="x" onerror="alert(1)">',
      createdAt: new Date().toISOString(),
    };

    render(<SummaryResult result={result} />);
    const container = screen.getByText("Safe content");
    expect(container.innerHTML).not.toContain("<script>");
    expect(container.innerHTML).not.toContain("onerror");
  });
});
