import type { Prisma } from "~/prisma/generated/prisma/client";
import DOMPurify from "dompurify";

type SummaryResultProps = {
  result: Prisma.SnippetCreateInput | undefined;
};
export default function SummaryResult({ result }: SummaryResultProps) {
  if (!result) {
    return "Summary";
  }

  const sanitizedSummary = DOMPurify.sanitize(result.summary || "");

  return (
    <div
      className="text-gray-500 text-sm"
      dangerouslySetInnerHTML={{ __html: sanitizedSummary }}
    />
  );
}
