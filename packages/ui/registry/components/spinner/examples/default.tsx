import { Spinner } from "@beam/ui/components/spinner";

export default function SpinnerDefault() {
  return (
    <p className="flex items-center gap-2 text-[14px] leading-[20px] text-text-2">
      <Spinner /> Processing payment
    </p>
  );
}
