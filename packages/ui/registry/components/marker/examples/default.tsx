import { Marker, MarkerContent } from "@beam/ui/components/marker";

export default function MarkerDefault() {
  return (
    <Marker variant="separator" className="w-[420px]">
      <MarkerContent>Today</MarkerContent>
    </Marker>
  );
}
