"use client";

import { ColumnDef } from "@tanstack/react-table";
import { monitorDataProps } from "@/features/Overview/types";
import Sparkline from "@/utils/sparkline";

const stateColor = {
  UP: "var(--color-sf-green)",
  DOWN: "var(--color-sf-red)",
  UNKNOWN: "var(--color-sf-text-muted)",
} as const;

const normalizeStatus = (status: string) => {
  if (status === "up" || status === "UP") return "UP";
  if (status === "down" || status === "DOWN") return "DOWN";
  return "UNKNOWN";
};

export const columns: ColumnDef<monitorDataProps>[] = [
  {
    accessorKey: "url_name",
    header: "MONITOR",
    cell: ({ row }) => {
      const state = normalizeStatus(row.original.status);
      const color = stateColor[state];
      return (
        <div className="flex items-center gap-3">
          <span
            className="h-2 w-2 shrink-0 rounded-full"
            style={{
              backgroundColor: color,
            }}
          />
          <span
            className="line-clamp-1 text-[13px] font-semibold text-sf-text leading-snug"
            title={row.getValue<string>("url_name")}
          >
            {row.getValue<string>("url_name")}
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
    accessorKey: "uptime",
    header: () => <span className="block text-center">UPTIME</span>,
    cell: ({ row }) => {
      const uptime = row.getValue<number | null>("uptime");
      const color =
        uptime == null
          ? "var(--color-sf-text-muted)"
          : uptime >= 99.9
          ? "var(--color-sf-text)"
          : uptime >= 95
            ? "var(--color-sf-amber)"
            : "var(--color-sf-red)";
      return (
        <span
          className="block text-center font-mono text-[12px] font-medium tabular-nums"
          style={{ color }}
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
      const state = normalizeStatus(row.original.status);
      if (state === "UNKNOWN") {
        return (
          <span className="block text-center font-mono text-[13px] tracking-widest text-sf-text-muted">
            – – –
          </span>
        );
      }
      return (
        <span className="flex w-full justify-center">
          <Sparkline
            data={row.getValue<number[]>("trend")}
            color={stateColor[state]}
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
    accessorKey: "statusCode",
    header: () => <span className="block text-center">STATUS</span>,
    cell: ({ row }) => {
      const code = row.getValue<number | null>("statusCode");
      if (code === null)
        return (
          <span className="block text-center font-mono text-[12px] text-sf-text-muted">
            —
          </span>
        );
      const isOk = code >= 200 && code < 300;
      return (
        <span
          className="mx-auto block w-fit rounded-sf border border-sf-border bg-sf-bg px-1.5 py-0.5 text-center font-mono text-[11px] font-medium tabular-nums"
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
    accessorKey: "interval_seconds",
    header: () => <span className="block text-center">INTERVAL</span>,
    cell: ({ row }) => (
      <span className="block text-center font-mono text-[12px] text-sf-text-sub tabular-nums">
        {row.getValue<number>("interval_seconds")}s
      </span>
    ),
  },
  {
    accessorKey: "next_check_at",
    header: () => <span className="block text-center">NEXT CHECK</span>,
    cell: ({ row }) => (
      <span className="block text-center font-mono text-[12px] text-sf-text-sub whitespace-nowrap">
        {row.getValue<string>("next_check_at")}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: () => <span className="block text-center">STATE</span>,
    cell: ({ row }) => {
      const state = normalizeStatus(row.original.status);
      const color = stateColor[state];
      const label =
        state === "UP" ? "Up" : state === "DOWN" ? "Down" : "Unknown";
      return (
        <span
          className="mx-auto flex w-fit min-w-20 items-center justify-center gap-1.5 rounded-sf border border-sf-border bg-sf-surface px-2 py-0.5 text-[12px] font-medium text-sf-text-sub"
          style={{
            color: state === "UNKNOWN" ? "var(--color-sf-text-muted)" : color,
          }}
        >
          <span
            className="h-1.5 w-1.5 shrink-0 rounded-full"
            style={{ backgroundColor: color }}
          />
          {label}
        </span>
      );
    },
  },
];
