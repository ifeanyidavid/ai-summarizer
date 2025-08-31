import { vi } from "vitest";
import type { AIService } from "../../../types/ai-service";

export class MockGeminiService implements AIService {
  async summarize(text: string): Promise<string> {
    return "Mocked summary response";
  }
}

vi.mock("../../services/ai/gemini", () => ({
  GeminiService: vi.fn().mockImplementation(() => new MockGeminiService()),
}));
