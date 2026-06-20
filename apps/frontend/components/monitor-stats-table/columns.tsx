"use client";

import { ColumnDef } from "@tanstack/react-table";
import { monitorDataProps } from "@/features/Overview/types";
import Sparkline from "@/utils/sparkline";

const stateColor = {
  up: "var(--color-sf-green)",
  down: "var(--color-sf-red)",
  paused: "var(--color-sf-text-muted)",
} as const;

export const columns: ColumnDef<monitorDataProps>[] = [
  {
    accessorKey: "name",
    header: "MONITOR",
    cell: ({ row }) => {
      const state = row.original.state;
      const color = stateColor[state];
      return (
        <div className="flex items-center gap-3">
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
          <span className="text-[13px] font-semibold text-sf-text whitespace-normal leading-snug">
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
      <span className="font-mono text-[12px] text-sf-text-sub whitespace-normal break-all">
        {row.getValue<string>("url")}
      </span>
    ),
  },
  {
    accessorKey: "uptime",
    header: "UPTIME",
    cell: ({ row }) => {
      const uptime = row.getValue<number>("uptime");
      const color =
        uptime >= 99.9
          ? "var(--color-sf-text)"
          : uptime >= 99
            ? "var(--color-sf-amber)"
            : "var(--color-sf-red)";
      return (
        <span
          className="font-mono text-[12px] tabular-nums"
          style={{ color }}
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
            – – –
          </span>
        );
      }
      return (
        <Sparkline
          data={row.getValue<number[]>("trend")}
          color={stateColor[state]}
          w={96}
          h={30}
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
    accessorKey: "statusCode",
    header: "STATUS",
    cell: ({ row }) => {
      const code = row.getValue<number | null>("statusCode");
      if (code === null)
        return <span className="font-mono text-[12px] text-sf-text-muted">—</span>;
      const isOk = code >= 200 && code < 300;
      return (
        <span
          className="font-mono text-[12px] tabular-nums"
          style={{
            color: isOk ? "var(--color-sf-green)" : "var(--color-sf-red)",
          }}
        >
          {code}
        </span>
      );
    },
  },
  {
    accessorKey: "interval",
    header: "INTERVAL",
    cell: ({ row }) => (
      <span className="font-mono text-[12px] text-sf-text-sub tabular-nums">
        {row.getValue<number>("interval")}s
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
      const label =
        state === "up" ? "Up" : state === "down" ? "Down" : "Paused";
      return (
        <span
          className="flex items-center justify-center gap-1.5 text-[13px] font-medium"
          style={{ color }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{ backgroundColor: color }}
          />
          {label}
        </span>
      );
    },
  },
];
