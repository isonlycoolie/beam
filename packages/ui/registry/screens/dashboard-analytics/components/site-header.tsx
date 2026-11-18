/* Based on shadcn/ui (MIT), converted to Beam components and tokens. */
import { Button } from "@beam/ui/components/button";
import { Separator } from "@beam/ui/components/separator";
import { SidebarTrigger } from "@beam/ui/components/sidebar";

export function SiteHeader() {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        <h1 className="text-[16px] leading-[24px] font-medium">Documents</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <a href="#" className="">
              GitHub
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
