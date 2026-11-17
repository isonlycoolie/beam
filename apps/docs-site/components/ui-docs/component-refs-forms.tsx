import { SettingsIcon, StarIcon } from "@hugeicons/core-free-icons";
import { Callout } from "@beam/ui/components/callout";
import { Label } from "@beam/ui/components/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@beam/ui/components/select";
import { Switch } from "@beam/ui/components/switch";
import { Tabs, TabsList, TabsTrigger } from "@beam/ui/components/tabs";
import { Icon } from "@beam/ui/icons";
import type { ComponentType } from "react";

const row = "text-[14px] leading-[20px] font-normal text-text-1";

/** Form controls set up like their measured captures (Pictures/beam/references/payments/ui). */
export const FORM_REFS: Record<string, { mode: "light" | "dark"; Component: ComponentType }> = {
  "ui-switch": {
    mode: "light",
    Component: () => (
      <div className="flex h-6 w-[316px] items-start justify-between">
        <Label className={row}>One-time payment</Label>
        <Switch defaultChecked aria-label="One-time payment" />
      </div>
    ),
  },
  "ui-select": {
    mode: "light",
    Component: () => (
      <div className="flex w-[316px] items-center justify-between">
        <Label className={`${row} h-[30px]`}>Button text</Label>
        <Select defaultValue="pay">
          <SelectTrigger aria-label="Button text">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pay">Pay</SelectItem>
            <SelectItem value="book">Book</SelectItem>
          </SelectContent>
        </Select>
      </div>
    ),
  },
  "ui-callout": {
    mode: "light",
    Component: () => (
      <Callout className="w-[316px]">
        Want more advanced features?
        <button type="button" className="w-fit text-[14px] leading-[24px] font-medium text-link">Change demo</button>
      </Callout>
    ),
  },
  "ui-tabs": {
    mode: "light",
    Component: () => (
      <div className="w-[364px] bg-card px-4 pt-3">
        <Tabs defaultValue="features">
          <TabsList>
            <TabsTrigger value="features">
              <Icon icon={StarIcon} size="sm" />
              <span>Features</span>
            </TabsTrigger>
            <TabsTrigger value="style">
              <Icon icon={SettingsIcon} size="sm" />
              <span>Style</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    ),
  },
};
