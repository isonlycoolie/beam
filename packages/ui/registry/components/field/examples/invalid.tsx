import { Field, FieldDescription, FieldError, FieldLabel } from "@beam/ui/components/field";
import { Input } from "@beam/ui/components/input";

export default function FieldInvalid() {
  return (
    <Field className="max-w-xs" data-invalid>
      <FieldLabel htmlFor="email-invalid">Work email</FieldLabel>
      <Input id="email-invalid" defaultValue="amina@company" aria-invalid />
      <FieldDescription>We send the invite here.</FieldDescription>
      <FieldError>Add the part after the dot, for example company.com.</FieldError>
    </Field>
  );
}
