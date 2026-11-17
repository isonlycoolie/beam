import { Button } from "@beam/ui/components/button";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@beam/ui/components/drawer";

export default function DrawerDefault() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Filter payments</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Filter payments</DrawerTitle>
          <DrawerDescription>Pick a status and a date range.</DrawerDescription>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
}
