"use client";

import type { ReactNode } from "react";
import { Gauge, Timer, Activity, Siren } from "lucide-react";
import { useDashboardOverview } from "@/features/Overview/hooks/useDashboardOverview";
import { useAllMonitorsData } from "../hooks/useMonitorsData";
import { useIncidentsStatsCard } from "@/features/incidents/hooks/useIncidentsStatsCard";
import { LIMIT } from "@/constants/constant";
import { buildAverageResponseSeries } from "@/utils/overview-series";
import Sparkline from "@/utils/sparkline";
import StatCard, { NoData } from "./overview-stats-card";
import Loader from "./loading";
import ErrorCard from "./error";

const uptimeColor = (uptime: number | null) => {
  if (uptime == null) return "var(--color-sf-text-muted)";
  if (uptime >= 99.9) return "var(--color-sf-green)";
  if (uptime >= 95) return "var(--color-sf-amber)";
  return "var(--color-sf-red)";
};

const UptimeBar = ({ pct, color }: { pct: number; color: string }) => (
  <div className="h-1.5 w-full overflow-hidden rounded-full bg-sf-bg ring-1 ring-inset ring-sf-border-faint">
    <div
      className="h-full rounded-full transition-[width] duration-500"
      style={{ width: `${Math.min(Math.max(pct, 0), 100)}%`, backgroundColor: color }}
    />
  </div>
);

const Chip = ({ children }: { children: ReactNode }) => (
  <span className="inline-flex items-center gap-1 rounded-md bg-sf-bg px-1.5 py-1 text-[10.5px] font-medium text-sf-text-sub ring-1 ring-inset ring-sf-border-faint">
    {children}
  </span>
);

const OverviewStats = () => {
  const { data: stats, isLoading, isError, refetch } = useDashboardOverview();
  const { data: monitors } = useAllMonitorsData(1, LIMIT);
  const { data: incidentStats } = useIncidentsStatsCard();

  if (isLoading) return <Loader />;
  if (isError || !stats) return <ErrorCard refetch={refetch} />;

  const uptime = stats.uptime_percentage;
  const avgLatency = stats.avg_total_checks;
  const totalChecks = stats.total_checks ?? 0;
  const checksPerMonitor =
    stats.total_monitors > 0
      ? Math.round(totalChecks / stats.total_monitors)
      : 0;
  const activeIncidents = incidentStats?.activeIncidents ?? 0;
  const totalIncidents = incidentStats?.totalIncidents ?? 0;
  const mttr = incidentStats?.mttrMinutes;

  const avgSeries = monitors
    ? buildAverageResponseSeries(monitors.data).filter(
        (value): value is number => value !== null,
      )
    : [];

  return (
    <section>
      <div className="mb-3 flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-sf-blue">
            Performance snapshot
          </p>
          <h2 className="mt-1 text-base font-semibold tracking-sf-tight text-sf-text">
            Key metrics
          </h2>
        </div>
        <p className="hidden text-[11px] text-sf-text-muted sm:block">
          Aggregated across all monitored endpoints
        </p>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {/* Uptime */}
      <StatCard
        metric="Uptime · 30d"
        icon={Gauge}
        value={uptime == null ? <NoData /> : `${uptime}%`}
        valueColor={uptimeColor(uptime)}
        context="Successful checks, last 30 days"
        tone="green"
        footer={
          uptime == null ? null : (
            <UptimeBar pct={uptime} color={uptimeColor(uptime)} />
          )
        }
      />

      {/* Average response */}
      <StatCard
        metric="Avg Response"
        icon={Timer}
        value={avgLatency == null ? <NoData /> : `${avgLatency}ms`}
        context="All-time, across all monitors"
        tone="blue"
        footer={
          avgSeries.length >= 2 ? (
            <div className="w-full rounded-md bg-sf-blue/[0.025] px-1">
              <Sparkline
                data={avgSeries}
                color="var(--color-sf-blue)"
                w={240}
                h={28}
                fluid
              />
            </div>
          ) : (
            <></>
          )
        }
      />

      {/* Volume */}
      <StatCard
        metric="Checks · Today"
        icon={Activity}
        value={totalChecks.toLocaleString()}
        context="Checks performed today"
        tone="amber"
        footer={
          <div className="flex w-full items-center gap-1.5">
            <Chip>{stats.total_monitors} monitors</Chip>
            <Chip>≈ {checksPerMonitor.toLocaleString()}/monitor</Chip>
          </div>
        }
      />

      {/* Incidents */}
      <StatCard
        metric="Active Incidents"
        icon={Siren}
        href="/dashboard/incidents"
        value={activeIncidents}
        valueColor={
          activeIncidents > 0
            ? "var(--color-sf-red)"
            : "var(--color-sf-green)"
        }
        context={activeIncidents > 0 ? "Needs attention" : "All clear"}
        tone={activeIncidents > 0 ? "red" : "green"}
        footer={
          <div className="flex w-full items-center gap-1.5">
            {mttr != null && mttr > 0 ? <Chip>MTTR {mttr}m</Chip> : null}
            <Chip>
              {totalIncidents > 0
                ? `${totalIncidents.toLocaleString()} total`
                : "No incidents yet"}
            </Chip>
          </div>
        }
      />
      </div>
    </section>
  );
};

export default OverviewStats;
