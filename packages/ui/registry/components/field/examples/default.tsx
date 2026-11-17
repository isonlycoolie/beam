import { Field, FieldDescription, FieldLabel } from "@beam/ui/components/field";
import { Input } from "@beam/ui/components/input";

export default function FieldDefault() {
  return (
    <Field className="max-w-xs">
      <FieldLabel htmlFor="workspace">Workspace URL</FieldLabel>
      <Input id="workspace" placeholder="acme" />
      <FieldDescription>Letters and dashes only. You can change it later.</FieldDescription>
    </Field>
  );
}
