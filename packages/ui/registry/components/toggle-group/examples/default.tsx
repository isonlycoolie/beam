import { ToggleGroup, ToggleGroupItem } from "@beam/ui/components/toggle-group";

export default function ToggleGroupDefault() {
  return (
    <ToggleGroup type="single" defaultValue="checkout" aria-label="Integration">
      <ToggleGroupItem value="checkout">Checkout</ToggleGroupItem>
      <ToggleGroupItem value="elements">Elements</ToggleGroupItem>
      <ToggleGroupItem value="mobile">Mobile</ToggleGroupItem>
    </ToggleGroup>
  );
}
