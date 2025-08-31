export interface AIService {
  summarize(text: string): Promise<string | undefined>;
}
