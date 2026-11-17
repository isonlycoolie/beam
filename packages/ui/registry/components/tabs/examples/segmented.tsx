import { Tabs, TabsList, TabsTrigger } from "@beam/ui/components/tabs";

export default function TabsSegmented() {
  return (
    <Tabs defaultValue="checkout">
      <TabsList variant="segmented">
        <TabsTrigger variant="segmented" value="checkout">Checkout</TabsTrigger>
        <TabsTrigger variant="segmented" value="elements">Elements</TabsTrigger>
        <TabsTrigger variant="segmented" value="mobile">Mobile</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
