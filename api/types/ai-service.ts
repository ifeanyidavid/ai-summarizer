export interface AIService {
  summarize(text: string): Promise<string | undefined>;
  withRetry<T>(operation: () => Promise<T>, retryCount?: number): Promise<T>;
  readonly maxRetries: number;
  readonly initialDelayMs: number;
  readonly maxTimeout: number;
}
