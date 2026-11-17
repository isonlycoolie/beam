import { Tabs, TabsList, TabsTrigger } from "@beam/ui/components/tabs";

export default function TabsDefault() {
  return (
    <Tabs defaultValue="features" className="w-[332px]">
      <TabsList>
        <TabsTrigger value="features">Features</TabsTrigger>
        <TabsTrigger value="style">Style</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
