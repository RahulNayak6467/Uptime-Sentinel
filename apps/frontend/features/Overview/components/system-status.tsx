"use client";

import { useEffect, useState } from "react";
import {
  CircleCheck,
  TriangleAlert,
  OctagonAlert,
  Moon,
  type LucideIcon,
} from "lucide-react";
import { useDashboardOverview } from "../hooks/useDashboardOverview";
import { DashboardOverviewResponse } from "../types";
import { formatTimeAgo } from "@/utils/format-time-ago";

type VerdictKey = "operational" | "degraded" | "outage" | "idle";

type Tone = {
  text: string;
  bg: string;
  border: string;
  dot: string;
};

const TONES: Record<VerdictKey, Tone> = {
  operational: {
    text: "text-sf-green",
    bg: "bg-sf-green-bg",
    border: "border-sf-green-border",
    dot: "bg-sf-green",
  },
  degraded: {
    text: "text-sf-amber",
    bg: "bg-sf-amber-bg",
    border: "border-sf-amber-border",
    dot: "bg-sf-amber",
  },
  outage: {
    text: "text-sf-red",
    bg: "bg-sf-red-bg",
    border: "border-sf-red-border",
    dot: "bg-sf-red",
  },
  idle: {
    text: "text-sf-text-muted",
    bg: "bg-sf-bg",
    border: "border-sf-border",
    dot: "bg-sf-text-muted/60",
  },
};

type Verdict = {
  key: VerdictKey;
  headline: string;
  sub: string;
  Icon: LucideIcon;
};

const resolveVerdict = (stats: DashboardOverviewResponse): Verdict => {
  const up = stats.up_count ?? 0;
  const down = stats.down_count ?? 0;
  const paused = stats.paused_monitors ?? 0;
  const total = stats.total_monitors ?? up + down + paused;
  const active = up + down;

  if (total === 0) {
    return {
      key: "idle",
      headline: "No monitors yet",
      sub: "Add your first endpoint to start tracking uptime",
      Icon: Moon,
    };
  }
  if (active === 0) {
    return {
      key: "idle",
      headline: "All monitors paused",
      sub: `${paused} monitor${paused === 1 ? "" : "s"} paused · nothing being checked`,
      Icon: Moon,
    };
  }
  if (down === 0) {
    return {
      key: "operational",
      headline: "All systems operational",
      sub: `${up} of ${active} monitor${active === 1 ? "" : "s"} reporting healthy`,
      Icon: CircleCheck,
    };
  }
  if (up === 0) {
    return {
      key: "outage",
      headline: "Major outage",
      sub: `All ${down} active monitor${down === 1 ? "" : "s"} are down`,
      Icon: OctagonAlert,
    };
  }
  return {
    key: "degraded",
    headline: "Partial outage",
    sub: `${down} of ${active} monitors are down`,
    Icon: TriangleAlert,
  };
};

const CountBlock = ({
  label,
  value,
  dot,
}: {
  label: string;
  value: number;
  dot: string;
}) => (
  <div className="min-w-[76px] px-4 first:pl-0 last:pr-0">
    <span className="flex items-center gap-1.5 text-xs font-medium text-sf-text-muted">
      <i className={`size-1.5 rounded-full ${dot}`} />
      {label}
    </span>
    <span className="mt-1.5 block text-xl font-semibold leading-none tracking-sf-tight tabular-nums text-sf-text">
      {value}
    </span>
  </div>
);

const Segment = ({ pct, color }: { pct: number; color: string }) => {
  if (pct <= 0) return null;
  return (
    <span
      className={`${color} h-full min-w-[3px] transition-[width] duration-500`}
      style={{ width: `${pct}%` }}
    />
  );
};

const SystemStatusSkeleton = () => (
  <section className="sf-panel flex min-h-[164px] flex-col gap-5 p-5">
    <div className="flex items-center gap-4">
      <div className="size-10 shrink-0 animate-pulse rounded-lg bg-sf-border" />
      <div className="flex flex-1 flex-col gap-2">
        <div className="h-4 w-52 animate-pulse rounded bg-sf-border" />
        <div className="h-3 w-72 animate-pulse rounded bg-sf-border" />
      </div>
    </div>
    <div className="h-2.5 w-full animate-pulse rounded-full bg-sf-border" />
  </section>
);

const SystemStatus = () => {
  const { data, isLoading, isError, dataUpdatedAt } = useDashboardOverview();

  // Re-render on an interval so the "updated Xs ago" label stays honest
  // without waiting for the next fetch to flush it.
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 5000);
    return () => clearInterval(id);
  }, []);

  if (isLoading) return <SystemStatusSkeleton />;
  if (isError || !data) return null;

  const verdict = resolveVerdict(data);
  const tone = TONES[verdict.key];
  const { Icon } = verdict;

  const up = data.up_count ?? 0;
  const down = data.down_count ?? 0;
  const paused = data.paused_monitors ?? 0;
  const total = Math.max(data.total_monitors ?? up + down + paused, 1);

  const upPct = (up / total) * 100;
  const downPct = (down / total) * 100;
  const pausedPct = (paused / total) * 100;

  return (
    <section className="sf-panel overflow-hidden">
      <div className="flex flex-col gap-6 p-5 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
        <div className="flex min-w-0 items-center gap-3.5">
          <span
            className={`flex size-10 shrink-0 items-center justify-center rounded-lg border ${tone.border} ${tone.bg} ${tone.text}`}
          >
            <Icon className="size-[18px]" strokeWidth={2} />
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold tracking-sf-tight text-sf-text">
                {verdict.headline}
              </h2>
              <span className={`size-1.5 rounded-full ${tone.dot}`} />
            </div>
            <p className="mt-1 text-xs text-sf-text-muted">
              {verdict.sub} · Updated {formatTimeAgo(dataUpdatedAt)}
            </p>
          </div>
        </div>

        <div className="flex divide-x divide-sf-border">
          <CountBlock label="Operational" value={up} dot="bg-sf-green" />
          <CountBlock label="Down" value={down} dot="bg-sf-red" />
          <CountBlock label="Paused" value={paused} dot="bg-sf-text-muted/60" />
        </div>
      </div>

      <div className="flex items-center gap-4 border-t border-sf-border bg-sf-bg/35 px-5 py-3">
        <div className="flex flex-1 items-center gap-3">
          <span className="shrink-0 text-xs font-medium text-sf-text-muted">
            Fleet health
          </span>
          <div className="flex h-1.5 flex-1 gap-px overflow-hidden rounded-full bg-sf-border-faint">
            <Segment pct={upPct} color="bg-sf-green" />
            <Segment pct={downPct} color="bg-sf-red" />
            <Segment pct={pausedPct} color="bg-sf-text-muted/45" />
          </div>
        </div>
        <span className="font-mono text-xs tabular-nums text-sf-text-muted">
          {up + down + paused} total
        </span>
      </div>
    </section>
  );
};

export default SystemStatus;
