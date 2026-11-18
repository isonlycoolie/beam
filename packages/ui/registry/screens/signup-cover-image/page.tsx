/* Based on shadcn/ui (MIT), converted to Beam components and tokens. */
import { LayoutGridIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { SignupForm } from "./components/signup-form";

export default function SignupPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex size-6 items-center justify-center rounded-(--radius-md) bg-primary text-primary-foreground">
              <HugeiconsIcon icon={LayoutGridIcon} strokeWidth={1.75} className="size-4" />
            </div>
            Acme Inc.
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <SignupForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-surface-2 lg:block">
        <img
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=80"
          alt="An open office with desks and plants"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
