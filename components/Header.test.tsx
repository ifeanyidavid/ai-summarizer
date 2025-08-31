import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Header from "./Header";

describe("Header", () => {
  it("renders the header title", () => {
    render(<Header />);
    expect(screen.getByText("AI Summarizer")).toBeInTheDocument();
  });

  it("has the correct styling classes", () => {
    render(<Header />);
    const header = screen.getByText("AI Summarizer").parentElement;
    expect(header).toHaveClass("flex", "items-center", "gap-3", "mb-6");
  });
});
