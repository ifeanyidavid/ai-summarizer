import { GeminiService } from "../../services/ai/gemini";
import type { AIService } from "../../types/ai-service";

export class AIFactory {
  private static instance: AIFactory;
  private aiService: AIService;

  private constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set");
    }
    this.aiService = new GeminiService(apiKey);
  }

  static getInstance(): AIFactory {
    if (!AIFactory.instance) {
      AIFactory.instance = new AIFactory();
    }
    return AIFactory.instance;
  }

  getAIService(): AIService {
    return this.aiService;
  }
}
