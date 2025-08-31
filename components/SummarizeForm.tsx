import { zodResolver } from "@hookform/resolvers/zod";
import DOMPurify from "dompurify";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";
import { Textarea } from "~/components/ui/textarea";

export const formSchema = z.object({
  text: z.string().min(10, {
    message: "Text must be at least 10 words.",
  }),
});

type SummarizeFormProps = {
  handleSubmit: (values: z.infer<typeof formSchema>) => void;
  isSubmitting?: boolean;
};

export default function SummarizeForm({
  handleSubmit,
  isSubmitting = false,
}: SummarizeFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (values.text.trim().length === 0) {
        toast.error("Please enter some text to summarize");
        return;
      }
      values.text = DOMPurify.sanitize(values.text);
      handleSubmit(values);
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  {...field}
                  className="resize-none"
                  placeholder="Enter text to summarize"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2
                className="mr-2 h-4 w-4 animate-spin"
                data-testid="loading-spinner"
              />
              Summarizing...
            </>
          ) : (
            "Summarize"
          )}
        </Button>
      </form>
    </Form>
  );
}
