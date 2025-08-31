import type { Prisma } from "~/prisma/generated/prisma/client";

type AllSummariesProps = {
  snippets: Prisma.SnippetCreateInput[] | undefined;
};
export default function AllSummaries({ snippets }: AllSummariesProps) {
  if (!snippets) {
    return null;
  }
  return (
    <div className="grid grid-cols-2 gap-4 p-6">
      {snippets.map((snippet) => (
        <div key={snippet.id}>{snippet.summary}</div>
      ))}
    </div>
  );
}
