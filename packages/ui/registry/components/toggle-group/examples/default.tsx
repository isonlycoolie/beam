import { ToggleGroup, ToggleGroupItem } from "@beam/ui/components/toggle-group";

export default function ToggleGroupDefault() {
  return (
    <ToggleGroup type="single" defaultValue="hosted" aria-label="Integration">
      <ToggleGroupItem value="hosted">Hosted</ToggleGroupItem>
      <ToggleGroupItem value="embedded">Embedded</ToggleGroupItem>
      <ToggleGroupItem value="mobile">Mobile</ToggleGroupItem>
    </ToggleGroup>
  );
}
