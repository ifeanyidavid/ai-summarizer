export function getPrompt(text: string) {
  return `You are a helpful assistant. Your task is to summarize the following text. Summarize in ≤ 30 words. Do not hallucinate or make up words. The final summary should be a complete sentence: "${text}".`;
}
