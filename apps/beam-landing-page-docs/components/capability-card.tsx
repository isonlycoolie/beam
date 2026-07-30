import type { LucideIcon } from "lucide-react";

type CapabilityCardProps = {
  icon: LucideIcon;
  label: string;
};

export function CapabilityCard({ icon: Icon, label }: CapabilityCardProps) {
  return (
    <div className="capabilityCard">
      <Icon size={18} />
      <span>{label}</span>
    </div>
  );
}
