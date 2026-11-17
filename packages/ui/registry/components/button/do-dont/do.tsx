import { Button } from "@beam/ui/components/button";

/** One primary action; the rest step back (rule action.one-primary). */
export default function ButtonDo() {
  return (
    <div className="flex gap-2">
      <Button variant="ghost">Cancel</Button>
      <Button variant="outline">Save draft</Button>
      <Button>Send invoice</Button>
    </div>
  );
}
