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
};

const stateLabel: Record<MonitorState, string> = {
  up: "Up",
  down: "Down",
  degraded: "Degraded",
  paused: "Paused",
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
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
        aria-label="Select all"
        className="border-sf-text-muted data-[state=checked]:bg-sf-text data-[state=checked]:border-sf-text"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(v) => row.toggleSelected(!!v)}
        aria-label="Select row"
        className="border-sf-text-muted data-[state=checked]:bg-sf-text data-[state=checked]:border-sf-text"
      />
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
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{
              backgroundColor: color,
              boxShadow:
                state === "down"
                  ? `0 0 0 4px color-mix(in srgb, ${color} 16%, transparent)`
                  : undefined,
            }}
          />
          <span className="text-[13px] font-semibold text-sf-text">
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
      <span className="font-mono text-[12px] text-sf-text-sub truncate block max-w-[200px]">
        {row.getValue<string>("url")}
      </span>
    ),
  },
  {
    accessorKey: "type",
    header: "TYPE",
    cell: ({ row }) => {
      const t = row.getValue<MonitorType>("type");
      return (
        <span className="px-1.5 py-0.5 rounded text-[11px] font-semibold font-mono bg-sf-text/10 text-sf-text-sub border border-sf-border tracking-wide">
          {typeBadge[t]}
        </span>
      );
    },
  },
  {
    accessorKey: "uptime",
    header: () => <span className="block text-right">UPTIME</span>,
    cell: ({ row }) => {
      const uptime = row.getValue<number>("uptime");
      const colorVar =
        uptime >= 99.9
          ? "var(--color-sf-text)"
          : uptime >= 99
            ? "var(--color-sf-amber)"
            : "var(--color-sf-red)";
      return (
        <span
          className="block text-right font-mono text-[12px] tabular-nums"
          style={{ color: colorVar }}
        >
          {uptime.toFixed(2)}%
        </span>
      );
    },
  },
  {
    accessorKey: "trend",
    header: "TREND",
    cell: ({ row }) => {
      const state = row.original.state;
      if (state === "paused") {
        return (
          <span className="font-mono text-[13px] tracking-widest text-sf-text-muted">
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
        <Sparkline
          data={row.getValue<number[]>("trend")}
          color={sparkColor}
          w={88}
          h={28}
        />
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
    header: "INTERVAL",
    cell: ({ row }) => (
      <span className="font-mono text-[12px] text-sf-text-sub">
        {row.getValue<string>("interval")}
      </span>
    ),
  },
  {
    accessorKey: "lastCheck",
    header: "LAST CHECK",
    cell: ({ row }) => (
      <span className="font-mono text-[12px] text-sf-text-sub whitespace-nowrap">
        {row.getValue<string>("lastCheck")}
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
          className="flex items-center justify-center gap-1.5 text-[13px] font-medium"
          style={{ color }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{ backgroundColor: color }}
          />
          {stateLabel[state]}
        </span>
      );
    },
  },
];
