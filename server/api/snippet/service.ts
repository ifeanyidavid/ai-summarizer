import type { AIService } from "../types/ai-service";
import prisma from "../../../lib/prisma";

export default class SnippetService {
  constructor(private readonly aiService: AIService) {}

  async createSnippet(text: string) {
    const summary = await this.aiService.summarize(text);
    return prisma.snippet.create({
      data: {
        text,
        summary,
        published: true,
      },
    });
  }

  async getSnippet(id: string) {
    return prisma.snippet.findUnique({
      where: { id },
    });
  }

  async getAllSnippets() {
    return prisma.snippet.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
    });
  }
}
