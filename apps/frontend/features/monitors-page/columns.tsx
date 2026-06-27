"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import Sparkline from "@/utils/sparkline";
import { MonitorPageData, MonitorState, MonitorType } from "./types";

const stateColor: Record<MonitorState, string> = {
  up: "var(--color-sf-green)",
  down: "var(--color-sf-red)",
  degraded: "var(--color-sf-amber)",
  paused: "var(--color-sf-text-muted)",
  unknown: "var(--color-sf-text-muted)",
};

const stateLabel: Record<MonitorState, string> = {
  up: "Up",
  down: "Down",
  degraded: "Degraded",
  paused: "Paused",
  unknown: "Unknown",
};

const typeBadge: Record<MonitorType, string> = {
  http: "HTTP",
  tcp: "TCP",
  dns: "DNS",
};

export const columns: ColumnDef<MonitorPageData>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <span className="flex justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
          aria-label="Select all"
          className="border-sf-text-muted data-[state=checked]:bg-sf-text data-[state=checked]:border-sf-text"
        />
      </span>
    ),
    cell: ({ row }) => (
      <span className="flex justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(v) => row.toggleSelected(!!v)}
          aria-label="Select row"
          className="border-sf-text-muted data-[state=checked]:bg-sf-text data-[state=checked]:border-sf-text"
        />
      </span>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "MONITOR",
    cell: ({ row }) => {
      const state = row.original.state;
      const color = stateColor[state];
      return (
        <div className="flex items-center gap-2.5">
          <span
            className="h-2 w-2 shrink-0 rounded-full"
            style={{
              backgroundColor: color,
            }}
          />
          <span
            className="line-clamp-1 text-[13px] font-semibold text-sf-text"
            title={row.getValue<string>("name")}
          >
            {row.getValue<string>("name")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "url",
    header: "URL",
    cell: ({ row }) => (
      <span
        className="block truncate font-mono text-[12px] text-sf-text-sub"
        title={row.getValue<string>("url")}
      >
        {row.getValue<string>("url")}
      </span>
    ),
  },
  {
    accessorKey: "type",
    header: () => <span className="block text-center">TYPE</span>,
    cell: ({ row }) => {
      const t = row.getValue<MonitorType>("type");
      return (
        <span className="rounded-sf border border-sf-border bg-sf-bg px-1.5 py-0.5 font-mono text-[11px] font-medium tracking-wide text-sf-text-sub">
          {typeBadge[t]}
        </span>
      );
    },
  },
  {
    accessorKey: "uptime",
    header: () => <span className="block text-center">UPTIME</span>,
    cell: ({ row }) => {
      const uptime = row.getValue<number | null>("uptime");
      const colorVar =
        uptime == null
          ? "var(--color-sf-text-muted)"
          : uptime >= 99.9
          ? "var(--color-sf-text)"
          : uptime >= 99
            ? "var(--color-sf-amber)"
            : "var(--color-sf-red)";
      return (
        <span
          className="block text-center font-mono text-[12px] font-medium tabular-nums"
          style={{ color: colorVar }}
        >
          {uptime == null ? "—" : `${uptime}%`}
        </span>
      );
    },
  },
  {
    accessorKey: "trend",
    header: () => <span className="block text-center">TREND</span>,
    cell: ({ row }) => {
      const state = row.original.state;
      if (state === "paused") {
        return (
          <span className="block text-center font-mono text-[13px] tracking-widest text-sf-text-muted">
            — —
          </span>
        );
      }
      const sparkColor =
        state === "down"
          ? "var(--color-sf-red)"
          : state === "degraded"
            ? "var(--color-sf-amber)"
            : "var(--color-sf-green)";
      return (
        <span className="flex w-full justify-center">
          <Sparkline
            data={row.getValue<number[]>("trend")}
            color={sparkColor}
            w={88}
            h={26}
          />
        </span>
      );
    },
  },
  {
    accessorKey: "responseTime",
    header: () => <span className="block text-right">RESPONSE</span>,
    cell: ({ row }) => {
      const ms = row.getValue<number | null>("responseTime");
      if (ms === null)
        return (
          <span className="block text-right font-mono text-[12px] text-sf-text-muted">
            —
          </span>
        );
      return (
        <span className="block text-right font-mono text-[12px] tabular-nums text-sf-text">
          {ms}
          <span className="text-sf-text-muted">ms</span>
        </span>
      );
    },
  },
  {
    accessorKey: "interval",
    header: () => <span className="block text-center">INTERVAL</span>,
    cell: ({ row }) => (
      <span className="block text-center font-mono text-[12px] text-sf-text-sub">
        {row.getValue<string>("interval")}
      </span>
    ),
  },
  {
    accessorKey: "nextCheck",
    header: () => <span className="block text-center">NEXT CHECK</span>,
    cell: ({ row }) => (
      <span className="block text-center font-mono text-[12px] text-sf-text-sub whitespace-nowrap">
        {row.getValue<string>("nextCheck")}
      </span>
    ),
  },
  {
    accessorKey: "state",
    header: () => <span className="block text-center">STATE</span>,
    cell: ({ row }) => {
      const state = row.original.state;
      const color = stateColor[state];
      return (
        <span
          className="mx-auto flex w-fit min-w-20 items-center justify-center gap-1.5 rounded-sf border border-sf-border bg-sf-surface px-2 py-0.5 text-[12px] font-medium text-sf-text-sub"
          style={{
            color:
              state === "paused" || state === "unknown"
                ? "var(--color-sf-text-muted)"
                : color,
          }}
        >
          <span
            className="h-1.5 w-1.5 shrink-0 rounded-full"
            style={{ backgroundColor: color }}
          />
          {stateLabel[state]}
        </span>
      );
    },
  },
];
