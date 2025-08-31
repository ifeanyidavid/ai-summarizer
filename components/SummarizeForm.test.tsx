import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";
import SummarizeForm from "./SummarizeForm";

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
  },
}));

describe("SummarizeForm", () => {
  const handleSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders form elements correctly", () => {
    render(<SummarizeForm handleSubmit={handleSubmit} />);

    expect(
      screen.getByPlaceholderText("Enter text to summarize")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /summarize/i })
    ).toBeInTheDocument();
  });

  it("shows validation error for short text", async () => {
    render(<SummarizeForm handleSubmit={handleSubmit} />);

    const textarea = screen.getByPlaceholderText("Enter text to summarize");
    await userEvent.type(textarea, "short");

    const submitButton = screen.getByRole("button", { name: /summarize/i });
    await userEvent.click(submitButton);

    expect(
      screen.getByText("Text must be at least 10 words.")
    ).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it("shows error toast for empty text submission", async () => {
    render(<SummarizeForm handleSubmit={handleSubmit} />);

    const textarea = screen.getByPlaceholderText("Enter text to summarize");
    await userEvent.type(textarea, "   ");

    const submitButton = screen.getByRole("button", { name: /summarize/i });
    await userEvent.click(submitButton);

    expect(screen.getByText(/Text must be at least 10 words./i)).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it("calls handleSubmit with sanitized text for valid submission", async () => {
    render(<SummarizeForm handleSubmit={handleSubmit} />);

    const textarea = screen.getByPlaceholderText("Enter text to summarize");
    const validText =
      "This is a valid text that should be long enough to pass validation.";
    await userEvent.type(textarea, validText);

    const submitButton = screen.getByRole("button", { name: /summarize/i });
    await userEvent.click(submitButton);

    expect(handleSubmit).toHaveBeenCalledWith({ text: validText });
  });

  it("handles XSS attempts by sanitizing input", async () => {
    render(<SummarizeForm handleSubmit={handleSubmit} />);

    const textarea = screen.getByPlaceholderText("Enter text to summarize");
    const maliciousText =
      '<script>alert("xss")</script> This is a valid text that contains script tags.';
    await userEvent.type(textarea, maliciousText);

    const submitButton = screen.getByRole("button", { name: /summarize/i });
    await userEvent.click(submitButton);

    expect(handleSubmit).toHaveBeenCalled();
    const call = handleSubmit.mock.calls[0][0];
    expect(call.text).not.toContain("<script>");
  });
});
