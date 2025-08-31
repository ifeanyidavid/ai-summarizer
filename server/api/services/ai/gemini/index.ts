import { GoogleGenAI } from "@google/genai";
import { getPrompt } from "../utils";
import type { AIService } from "../../../types/ai-service";

export class GeminiService implements AIService {
  private readonly client: GoogleGenAI;
  private readonly model: string = "gemini-2.5-flash";

  constructor(apiKey: string) {
    this.client = new GoogleGenAI({ apiKey });
  }

  async summarize(text: string): Promise<string | undefined> {
    const prompt = getPrompt(text);
    const response = await this.client.models.generateContentStream({
      model: this.model,
      contents: prompt,
      config: {
        systemInstruction:
          "You are a helpful assistant with deep knowledge about the world.",
      },
    });

    for await (const chunk of response) {
      console.log(chunk.text);
    }

    return "response.text";
  }
}
