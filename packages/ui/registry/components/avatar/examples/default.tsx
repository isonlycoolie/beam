import { Avatar, AvatarFallback } from "@beam/ui/components/avatar";

export default function AvatarDefault() {
  return (
    <div className="flex items-center gap-3">
      <Avatar>
        <AvatarFallback>JR</AvatarFallback>
      </Avatar>
      <span className="text-[14px] leading-[20px] text-text-1">Jenny Rosen</span>
    </div>
  );
}
