/* Based on shadcn/ui (MIT), converted to Beam components and tokens. */
import { Button } from "@beam/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@beam/ui/components/card";
import { SidebarInput } from "@beam/ui/components/sidebar";

export function SidebarOptInForm() {
  return (
    <Card className="gap-2 py-4 shadow-none">
      <CardHeader className="px-4">
        <CardTitle className="text-[14px] leading-[20px]">Subscribe to our newsletter</CardTitle>
        <CardDescription>Opt-in to receive updates and news about the sidebar.</CardDescription>
      </CardHeader>
      <CardContent className="px-4">
        <form>
          <div className="grid gap-2.5">
            <SidebarInput type="email" placeholder="Email" />
            <Button className="w-full bg-sidebar-primary text-sidebar-primary-foreground shadow-none" size="sm">
              Subscribe
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
