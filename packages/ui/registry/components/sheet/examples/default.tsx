import { Button } from "@beam/ui/components/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@beam/ui/components/sheet";

export default function SheetDefault() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open details</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Payment pi_3Nk2</SheetTitle>
          <SheetDescription>Succeeded on 17 November, TZS 78,800.08.</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
