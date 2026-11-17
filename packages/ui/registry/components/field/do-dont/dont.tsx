import { Input } from "@beam/ui/components/input";

/** The placeholder is the label: it disappears as soon as the user types. */
export default function FieldDont() {
  return <Input className="max-w-xs" placeholder="Phone number" aria-label="Phone number" />;
}
