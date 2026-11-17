"use client";

import { Bar, BarChart, XAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@beam/ui/components/chart";

const DATA = [
  { day: "Mon", volume: 186 },
  { day: "Tue", volume: 305 },
  { day: "Wed", volume: 237 },
  { day: "Thu", volume: 173 },
  { day: "Fri", volume: 409 },
];
const CONFIG = { volume: { label: "Volume", color: "var(--chart-1)" } } satisfies ChartConfig;

export default function ChartDefault() {
  return (
    <ChartContainer config={CONFIG} className="h-48 w-[420px]">
      <BarChart data={DATA}>
        <XAxis dataKey="day" tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="volume" fill="var(--color-volume)" radius={3} />
      </BarChart>
    </ChartContainer>
  );
}
