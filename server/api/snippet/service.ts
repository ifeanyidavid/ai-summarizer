import type { AIService } from "../types/ai-service";
import prisma from "../../../lib/prisma";

export default class SnippetService {
  constructor(private readonly aiService: AIService) {}

  async createSnippet(text: string) {
    try {
      const summary = await this.aiService.summarize(text);
      return prisma.snippet.create({
        data: {
          text,
          summary,
          published: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async getSnippet(id: string) {
    try {
      return prisma.snippet.findUnique({
        where: { id },
      });
    } catch (error) {
      throw error;
    }
  }

  async getAllSnippets() {
    try {
      return prisma.snippet.findMany({
        where: { published: true },
        orderBy: { createdAt: "desc" },
      });
    } catch (error) {
      throw error;
    }
  }
}
