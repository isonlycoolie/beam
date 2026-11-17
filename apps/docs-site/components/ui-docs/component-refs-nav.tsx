import { ArrowDown01Icon, Copy01Icon } from "@hugeicons/core-free-icons";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@beam/ui/components/breadcrumb";
import { SidebarGroupLabel, SidebarMenuButton } from "@beam/ui/components/sidebar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@beam/ui/components/table";
import { Icon } from "@beam/ui/icons";
import type { ComponentType } from "react";

// The table rows, as captured (Pictures/beam/references/payments/ui/table.json).
const ROWS = [
  ["Visa FSA", ["4000", "0512", "3000", "0072"]],
  ["Visa HSA", ["4000", "0512", "3000", "0072"]],
  ["Mastercard FSA", ["5200", "8282", "8282", "8897"]],
] as const;

/** Navigation and data components set up like their measured captures. */
export const NAV_REFS: Record<string, { mode: "light" | "dark"; Component: ComponentType }> = {
  "ui-breadcrumb": {
    mode: "light",
    Component: () => (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Payments</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    ),
  },
  "ui-nav-active": {
    mode: "light",
    Component: () => (
      <SidebarMenuButton href="#" nested isActive className="w-[244px]">
        <span>Create a customer</span>
      </SidebarMenuButton>
    ),
  },
  "ui-nav-group": {
    mode: "light",
    Component: () => (
      <SidebarMenuButton href="#" className="w-[260px]">
        <span>Core Resources</span>
        <Icon icon={ArrowDown01Icon} size="sm" className="ms-auto" />
      </SidebarMenuButton>
    ),
  },
  "ui-nav-section": { mode: "light", Component: () => <SidebarGroupLabel className="w-fit">Online payments</SidebarGroupLabel> },
  "ui-table": {
    mode: "light",
    Component: () => (
      <Table className="w-[793px] table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[182px]">Brand/Type</TableHead>
            <TableHead className="w-[283px]">Number</TableHead>
            <TableHead className="w-[147px]">CVC</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ROWS.map(([brand, groups], i) => (
            <TableRow key={brand} data-state={i === 0 ? "selected" : undefined}>
              <TableCell>{brand}</TableCell>
              <TableCell>
                {/* The captured cell is a 21px copy button: the number in groups, then a 14px copy icon. */}
                <button type="button" className="inline-flex h-[21px] items-center gap-2 text-text-3">
                  {/* As captured: three inline-block groups (20px boxes, 8px apart) and a plain inline last group. */}
                  <span className="font-[family-name:var(--theme-font-mono)] leading-[20px] font-medium text-text-1">
                    {groups.map((g, k) =>
                      k < groups.length - 1 ? (
                        <span key={k} className="me-2 inline-block">
                          {g}
                        </span>
                      ) : (
                        <span key={k}>{g}</span>
                      ),
                    )}
                  </span>
                  <Icon icon={Copy01Icon} size="sm" className="size-3.5" />
                </button>
              </TableCell>
              <TableCell>Any 3 digits</TableCell>
              <TableCell>Any future date</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    ),
  },
};
