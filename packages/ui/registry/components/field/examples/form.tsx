import { Button } from "@beam/ui/components/button";
import { Field, FieldGroup, FieldLabel } from "@beam/ui/components/field";
import { Input } from "@beam/ui/components/input";

export default function FieldForm() {
  return (
    <form className="w-full max-w-sm">
      <FieldGroup>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="first">First name</FieldLabel>
            <Input id="first" placeholder="Amina" />
          </Field>
          <Field>
            <FieldLabel htmlFor="last">Last name</FieldLabel>
            <Input id="last" placeholder="Juma" />
          </Field>
        </div>
        <Field>
          <FieldLabel htmlFor="work">Work email</FieldLabel>
          <Input id="work" type="email" placeholder="amina@company.com" />
        </Field>
        <Button className="w-full">Create account</Button>
      </FieldGroup>
    </form>
  );
}
