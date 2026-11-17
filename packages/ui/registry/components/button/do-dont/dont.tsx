import { Button } from "@beam/ui/components/button";

/** Three primary buttons: nothing tells the user which one matters. */
export default function ButtonDont() {
  return (
    <div className="flex gap-2">
      <Button>Cancel</Button>
      <Button>Save draft</Button>
      <Button>Submit</Button>
    </div>
  );
}
