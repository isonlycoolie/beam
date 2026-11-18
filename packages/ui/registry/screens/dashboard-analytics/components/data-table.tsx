/* Based on shadcn/ui (MIT), converted to Beam components and tokens. */
"use client";

import * as React from "react";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Add01Icon,
  ArrowDown01Icon,
  ArrowLeft01Icon,
  ArrowLeftDoubleIcon,
  ArrowRight01Icon,
  ArrowRightDoubleIcon,
  ChartIncreaseIcon,
  CheckmarkCircle02Icon,
  DragDropVerticalIcon,
  LayoutTwoColumnIcon,
  Loading03Icon,
  MoreVerticalIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  columnFilteringFeature,
  columnVisibilityFeature,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  FlexRender,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  tableFeatures,
  useTable,
  type ColumnFiltersState,
  type ColumnVisibilityState,
  type Row,
  type SortingState,
} from "@tanstack/react-table";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { toast } from "sonner";
import { z } from "zod";

import { useIsMobile } from "@beam/ui/lib/use-mobile";
import { Badge } from "@beam/ui/components/badge";
import { Button } from "@beam/ui/components/button";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@beam/ui/components/chart";
import { Checkbox } from "@beam/ui/components/checkbox";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@beam/ui/components/drawer";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@beam/ui/components/dropdown-menu";
import { Input } from "@beam/ui/components/input";
import { Label } from "@beam/ui/components/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@beam/ui/components/select";
import { Separator } from "@beam/ui/components/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@beam/ui/components/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@beam/ui/components/tabs";

// New in v9: declare the features this table uses — anything you don't
// register is tree-shaken out of the bundle.
const features = tableFeatures({
  columnFilteringFeature,
  columnVisibilityFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
});

const columnHelper = createColumnHelper<typeof features, z.infer<typeof schema>>();

export const schema = z.object({
  id: z.number(),
  header: z.string(),
  type: z.string(),