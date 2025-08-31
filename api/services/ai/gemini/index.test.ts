import { GoogleGenAI } from "@google/genai";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import APIError from "../../../middleware/error.js";
import { GeminiService } from "./index.js";

vi.mock("@google/genai");
vi.mock("../../../utils", () => ({
  getPrompt: (text: string) => text,
}));

describe("GeminiService", () => {
  let service: GeminiService;
  let mockGenerateContent: ReturnType<typeof vi.fn>;

  class TestGeminiService extends GeminiService {
    constructor(
      apiKey: string,
      public override maxTimeout: number
    ) {
      super(apiKey);
    }
  }

  beforeEach(() => {
    vi.clearAllMocks();
    mockGenerateContent = vi.fn();
    vi.mocked(GoogleGenAI).mockImplementation(
      () =>
        ({
          models: {
            generateContent: mockGenerateContent,
          },
        }) as any
    );
    service = new GeminiService("fake-api-key");
  });

  describe("withRetry", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("should return result on successful operation", async () => {
      const operation = vi.fn().mockResolvedValue("success");
      const result = await service.withRetry(operation);
      expect(result).toBe("success");
      expect(operation).toHaveBeenCalledTimes(1);
    });

    it("should retry on retryable errors", async () => {
      const operation = vi
        .fn()
        .mockRejectedValueOnce({ status: 429, message: "Rate limited" })
        .mockRejectedValueOnce({ status: 500, message: "Internal error" })
        .mockResolvedValueOnce("success");

      const resultPromise = service.withRetry(operation);

      for (let i = 0; i < 2; i++) {
        await vi.runAllTimersAsync();
      }

      const result = await resultPromise;
      expect(result).toBe("success");
      expect(operation).toHaveBeenCalledTimes(3);
    });

    it("should not retry on non-retryable errors", async () => {
      const error = new Error("Operation blocked");
      const operation = vi.fn().mockRejectedValue(error);

      await expect(service.withRetry(operation)).rejects.toThrow(error);
      expect(operation).toHaveBeenCalledTimes(1);
    });

    it("should throw error after maxTimeout", async () => {
      const testService = new TestGeminiService("fake-api-key", 50);
      const operation = vi.fn().mockRejectedValue(new Error("Network error"));

      const now = new Date(2023, 0, 1).getTime();
      vi.setSystemTime(now);

      const promise = testService.withRetry(operation);

      vi.advanceTimersByTime(testService.maxTimeout + 1);

      await expect(promise).rejects.toThrow("Operation timed out");
      expect(operation).toHaveBeenCalledTimes(1);
    });
  });

  describe("summarize", () => {
    it("should use withRetry for generateContent calls", async () => {
      mockGenerateContent.mockResolvedValueOnce({ text: "Summary" });

      const result = await service.summarize("text to summarize");

      expect(result).toBe("Summary");
      expect(mockGenerateContent).toHaveBeenCalledWith({
        model: "gemini-2.5-flash",
        contents: "text to summarize",
        config: {
          systemInstruction:
            "You are a helpful assistant with deep knowledge about the world.",
        },
      });
    });

    it("should throw APIError for empty response", async () => {
      mockGenerateContent.mockResolvedValue({ text: "" });
      await expect(service.summarize("text")).rejects.toThrowError(APIError);
      await expect(service.summarize("text")).rejects.toThrow(
        "Received empty or non-text response from AI"
      );
    });

    it("should wrap errors in APIError", async () => {
      mockGenerateContent.mockRejectedValue(
        new Error("blocked by safety system")
      );

      const promise = service.summarize("text");
      await expect(promise).rejects.toThrowError(APIError);
      await expect(promise).rejects.toThrow(
        "Failed to generate summary: Error: blocked by safety system"
      );
    });
  });
});
