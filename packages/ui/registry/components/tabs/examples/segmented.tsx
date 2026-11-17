import { Tabs, TabsList, TabsTrigger } from "@beam/ui/components/tabs";

export default function TabsSegmented() {
  return (
    <Tabs defaultValue="hosted">
      <TabsList variant="segmented">
        <TabsTrigger variant="segmented" value="hosted">Hosted</TabsTrigger>
        <TabsTrigger variant="segmented" value="embedded">Embedded</TabsTrigger>
        <TabsTrigger variant="segmented" value="mobile">Mobile</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
