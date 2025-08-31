import { render, screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { toast } from "sonner";
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import type { Route } from "./+types/home";
import Home from "./home";

const mockSubmit = vi.fn();
const mockNavigation = { state: "idle" };

vi.mock("react-router", () => ({
  useSubmit: () => mockSubmit,
  useNavigation: () => mockNavigation,
}));

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
  },
}));

const server = setupServer(
  http.get("http://localhost:3000/api/snippets", () => {
    return HttpResponse.json([
      {
        id: "1",
        text: "Test text",
        summary: "Test summary",
        createdAt: new Date().toISOString(),
      },
    ]);
  }),

  http.post("http://localhost:3000/api/snippets", () => {
    return HttpResponse.json({
      id: "2",
      text: "New text",
      summary: "New summary",
      createdAt: new Date().toISOString(),
    });
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("Home Route", () => {
  const mockRouteProps: Route.ComponentProps = {
    params: {},
    matches: [
      {
        id: "root",
        params: {},
        pathname: "/",
        data: undefined,
        loaderData: undefined,
        handle: undefined,
      },
      {
        id: "routes/home",
        params: {},
        pathname: "/",
        data: { snippets: [] },
        loaderData: { snippets: [] },
        handle: undefined,
      },
    ],
    actionData: undefined,
    loaderData: {
      snippets: [],
    },
  };

  it("renders the main layout correctly", () => {
    render(<Home {...mockRouteProps} />);

    expect(screen.getByText("AI Summarizer")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter text to summarize")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /summarize/i })
    ).toBeInTheDocument();
    expect(screen.getByText("Summary")).toBeInTheDocument();
  });

  it("displays error toast when action returns error", () => {
    const props = {
      ...mockRouteProps,
      actionData: {
        error: "Test error message",
      },
    };

    render(<Home {...props} />);

    expect(toast.error).toHaveBeenCalledWith("Test error message");
  });

  it("displays successful summary result", () => {
    const props = {
      ...mockRouteProps,
      actionData: {
        data: {
          id: "1",
          text: "Test text",
          summary: "Generated summary",
          createdAt: new Date().toISOString(),
        },
      },
    };

    render(<Home {...props} />);
    expect(screen.getByText("Generated summary")).toBeInTheDocument();
  });

  it("shows loading state when form is being submitted", () => {
    mockNavigation.state = "submitting";
    render(<Home {...mockRouteProps} />);

    const button = screen.getByRole("button");
    expect(button).toHaveTextContent("Summarizing...");
    expect(button).toBeDisabled();
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("shows normal state when form is not being submitted", () => {
    mockNavigation.state = "idle";
    render(<Home {...mockRouteProps} />);

    const button = screen.getByRole("button");
    expect(button).toHaveTextContent("Summarize");
    expect(button).not.toBeDisabled();
    expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
  });
});
