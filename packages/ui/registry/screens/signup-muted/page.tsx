/* Based on shadcn/ui (MIT), converted to Beam components and tokens. */
import { LayoutGridIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { SignupForm } from "./components/signup-form";

export default function SignupPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-surface-2 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="flex size-6 items-center justify-center rounded-(--radius-md) bg-primary text-primary-foreground">
            <HugeiconsIcon icon={LayoutGridIcon} strokeWidth={1.75} className="size-4" />
          </div>
          Acme Inc.
        </a>
        <SignupForm />
      </div>
    </div>
  );
}
