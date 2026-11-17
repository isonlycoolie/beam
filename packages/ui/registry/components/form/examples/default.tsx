"use client";

import { useForm } from "react-hook-form";
import { Button } from "@beam/ui/components/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@beam/ui/components/form";
import { Input } from "@beam/ui/components/input";

export default function FormDefault() {
  return (
    <FormExample />
  );
}

function FormExample() {
  const form = useForm({ defaultValues: { email: "" } });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(() => undefined)} className="flex w-[378px] flex-col gap-4">
        <FormField
          control={form.control}
          name="email"
          rules={{ required: "Enter an email address" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email@example.com" {...field} />
              </FormControl>
              <FormDescription>Receipts go here.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Continue</Button>
      </form>
    </Form>
  );
}
