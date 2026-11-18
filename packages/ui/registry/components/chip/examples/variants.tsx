import { Chip } from "@beam/ui/components/chip";

export default function ChipVariants() {
  return (
    <div className="flex flex-wrap gap-2">
      <Chip>Draft</Chip>
      <Chip variant="info">In review</Chip>
      <Chip variant="success">Approved</Chip>
      <Chip variant="warning">Needs changes</Chip>
      <Chip variant="danger">Blocked</Chip>
    </div>
  );
}
