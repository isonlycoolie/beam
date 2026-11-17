import { Button } from "@beam/ui/components/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@beam/ui/components/dialog";

export default function DialogDefault() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Choose a demo</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Full page</DialogTitle>
          <DialogDescription>Launch payments out of the box.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button className="w-[200px]">View demo</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
