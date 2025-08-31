import { vi } from "vitest";

export const mockSummarize = vi.fn().mockResolvedValue("Mocked summary");

vi.mock("../services/ai/gemini", () => ({
  GeminiService: vi.fn().mockImplementation(() => ({
    summarize: mockSummarize,
  })),
}));

vi.mock("../services/ai", () => ({
  AIFactory: {
    getInstance: vi.fn().mockReturnValue({
      getAIService: vi.fn().mockReturnValue({
        summarize: mockSummarize,
      }),
    }),
  },
}));
