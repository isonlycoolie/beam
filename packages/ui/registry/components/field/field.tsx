/* Based on shadcn/ui Field (MIT). Simplified for Beam UI: a visible label, optional help, and an error that replaces it. */
import type * as React from "react";
import { cn } from "../../../lib/cn";
import { Label } from "../label";

/** One form field: label on top, control, then help or error. Rule form.labels-visible. */
function Field({ className, invalid, ...props }: React.ComponentProps<"div"> & { invalid?: boolean }) {
  return (
    <div
      role="group"
      data-slot="field"
      data-invalid={invalid || undefined}
      className={cn("group/field flex w-full flex-col gap-1.5", className)}
      {...props}
    />
  );
}

function FieldLabel(props: React.ComponentProps<typeof Label>) {
  return <Label data-slot="field-label" {...props} />;
}

/** Help text: one short line on how to fill the field. Hidden while an error shows. */
function FieldDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="field-description"
      className={cn("text-small text-text-2 group-data-[invalid=true]/field:hidden", className)}
      {...props}
    />
  );
}

/** What went wrong and how to fix it, in one sentence. */
function FieldError({ className, children, ...props }: React.ComponentProps<"p">) {
  if (!children) return null;
  return (
    <p role="alert" data-slot="field-error" className={cn("text-small font-medium text-danger", className)} {...props}>
      {children}
    </p>
  );
}

/** Stacks fields with the form rhythm. Short related pairs can sit side by side with columns={2}. */
function FieldGroup({ className, columns = 1, ...props }: React.ComponentProps<"div"> & { columns?: 1 | 2 }) {
  return (
    <div
      data-slot="field-group"
      className={cn("grid gap-5", columns === 2 && "sm:grid-cols-2 sm:gap-x-4", className)}
      {...props}
    />
  );
}

export { Field, FieldDescription, FieldError, FieldGroup, FieldLabel };
