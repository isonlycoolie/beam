import { Field, FieldDescription, FieldLabel } from "@beam/ui/components/field";
import { Input } from "@beam/ui/components/input";

/** A visible label; the placeholder is only an example (rule form.labels-visible). */
export default function FieldDo() {
  return (
    <Field className="max-w-xs">
      <FieldLabel htmlFor="phone-do">Phone number</FieldLabel>
      <Input id="phone-do" placeholder="0712 345 678" />
      <FieldDescription>We text the code here.</FieldDescription>
    </Field>
  );
}
