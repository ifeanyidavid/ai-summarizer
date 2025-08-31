import axios, { type AxiosResponse } from "axios";
import DOMPurify from "dompurify";
import { useEffect } from "react";
import { useNavigation, useSubmit } from "react-router";
import { toast } from "sonner";
import type z from "zod";
import Header from "~/components/Header";
import SummarizeForm, { formSchema } from "~/components/SummarizeForm";
import SummaryResult from "~/components/SummaryResult";
import type { Prisma } from "~/prisma/generated/prisma/client";
import type { Route } from "./+types/home";

const url = "http://localhost:3000/api/snippets";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  let text = formData.get("text");
  if (typeof text !== "string" || text.length === 0) {
    return { error: "Text must only contain valid characters and not empty" };
  }
  try {
    const response: AxiosResponse<Prisma.SnippetCreateInput> = await axios.post(
      url,
      { text }
    );

    return { data: response.data };
  } catch (error) {
    return {
      error: "Failed to create snippet",
    };
  }
}

export async function clientLoader({ context }: Route.LoaderArgs) {
  try {
    const response = await axios.get(url);
    if (response.status !== 200) {
      throw new Error(`Response status: ${response.status}`);
    }
    const data = await response.data;
    const sanitizedData = data.map((snippet: any) => ({
      ...snippet,
      text: DOMPurify.sanitize(snippet.text),
      summary: DOMPurify.sanitize(snippet.summary),
    }));

    return {
      snippets: sanitizedData,
    };
  } catch (error) {
    return {
      snippets: [],
    };
  }
}

export default function Home({ actionData }: Route.ComponentProps) {
  const submit = useSubmit();
  const navigation = useNavigation();
  const response = actionData;

  const isSubmitting = navigation.state === "submitting";

  useEffect(() => {
    if (actionData?.error) {
      toast.error(actionData.error);
    }
  }, [actionData]);

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    submit(data, { method: "post" });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Header />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <SummarizeForm
                handleSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="min-h-[300px] bg-gray-50 rounded-md p-4">
                <SummaryResult result={response?.data} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
