import { GoogleGenAI } from "@google/genai";
import APIError from "../../../middleware/error";
import type { AIService } from "../../../types/ai-service";
import { getPrompt } from "../../../utils";

export class GeminiService implements AIService {
  private readonly client: GoogleGenAI;
  private readonly model: string = "gemini-2.5-flash";
  readonly maxRetries: number = 3;
  readonly initialDelayMs: number = 1000;
  readonly maxTimeout: number = 30000;

  constructor(apiKey: string) {
    this.client = new GoogleGenAI({ apiKey });
  }

  private isHttpError(
    error: unknown
  ): error is { status?: number; statusCode?: number } {
    return (
      typeof error === "object" &&
      error !== null &&
      ("status" in error || "statusCode" in error)
    );
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    return String(error || "");
  }

  async withRetry<T>(
    operation: () => Promise<T>,
    retryCount: number = 0,
    startTime: number = Date.now()
  ): Promise<T> {
    try {
      return await operation();
    } catch (err) {
      if (Date.now() - startTime >= this.maxTimeout) {
        throw new Error(`Operation timed out after ${this.maxTimeout}ms`);
      }

      const errorMessage = this.getErrorMessage(err).toLowerCase();
      const statusCode = this.isHttpError(err)
        ? err.status || err.statusCode
        : null;

      const isBlockingError =
        errorMessage.includes("blocked") || errorMessage.includes("safety");

      const isRetryableStatus = statusCode
        ? [429, 500, 503].includes(statusCode)
        : errorMessage.includes("429") ||
          errorMessage.includes("500") ||
          errorMessage.includes("503");

      const isRetryable =
        !isBlockingError &&
        (isRetryableStatus ||
          errorMessage.includes("deadline_exceeded") ||
          errorMessage.includes("internal") ||
          errorMessage.includes("network error") ||
          errorMessage.includes("socket hang up") ||
          errorMessage.includes("unavailable") ||
          errorMessage.includes("could not connect"));

      if (!isRetryable || retryCount >= this.maxRetries) {
        throw err;
      }

      const delayMs = Math.min(
        this.initialDelayMs * Math.pow(2, retryCount),
        this.maxTimeout - (Date.now() - startTime)
      );

      if (delayMs <= 0) {
        throw new Error(
          `Operation would exceed timeout of ${this.maxTimeout}ms`
        );
      }

      console.log(
        `Attempt ${retryCount + 1} failed (${errorMessage}). Retrying in ${delayMs}ms...`
      );

      await new Promise((resolve) => setTimeout(resolve, delayMs));
      return this.withRetry(operation, retryCount + 1, startTime);
    }
  }

  async summarize(text: string): Promise<string | undefined> {
    try {
      const prompt = getPrompt(text);

      const response = await this.withRetry(async () => {
        return this.client.models.generateContent({
          model: this.model,
          contents: prompt,
          config: {
            systemInstruction:
              "You are a helpful assistant with deep knowledge about the world.",
          },
        });
      });

      if (typeof response.text !== "string" || !response.text) {
        console.error(`Empty response received from AI.`);
        throw new APIError(500, `Received empty or non-text response from AI.`);
      }

      return response.text;
    } catch (error) {
      console.error((error as Error).message);
      throw new APIError(500, `Failed to generate summary: ${error}`);
    }
  }
}
