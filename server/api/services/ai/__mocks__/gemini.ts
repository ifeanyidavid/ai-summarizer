import { vi } from "vitest";
import type { AIService } from "../../../types/ai-service";

export class MockGeminiService implements AIService {
  readonly maxRetries: number = 3;
  readonly initialDelayMs: number = 1000;
  readonly maxTimeout: number = 30000;

  async summarize(text: string): Promise<string> {
    return "Mocked summary response";
  }

  async withRetry<T>(
    operation: () => Promise<T>,
    retryCount?: number
  ): Promise<T> {
    return operation();
  }
}

vi.mock("../../services/ai/gemini", () => ({
  GeminiService: vi.fn().mockImplementation(() => new MockGeminiService()),
}));
