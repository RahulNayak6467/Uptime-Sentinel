"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDurationMinutes } from "@/utils/format-duration-minutes";
import { useIncidentsStatsCard } from "./hooks/useIncidentsStatsCard";
import IncidentStatCard from "./incident-stat-card";
import IncidentStatsError from "./incident-stats-error";

const IncidentStatsSkeleton = () => (
  <div
    className="w-full"
    role="status"
    aria-label="Loading incident statistics"
  >
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="flex min-h-[106px] w-full flex-col justify-center gap-2 rounded-lg border border-sf-border bg-sf-surface p-5"
        >
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-7 w-16" />
        </div>
      ))}
    </div>
  </div>
);

const IncidentStats = () => {
  const { data, isLoading, isError, refetch } = useIncidentsStatsCard();

  if (isLoading) {
    return <IncidentStatsSkeleton />;
  }

  if (isError || !data) {
    return <IncidentStatsError onRetry={() => void refetch()} />;
  }

  const incidentStats = [
    {
      id: "active-incidents",
      title: "Active",
      information: data.activeIncidents,
      color: "var(--color-sf-red)",
    },
    {
      id: "total-incidents",
      title: "Last 30 Days",
      information: data.totalIncidents,
      color: "var(--color-sf-text)",
    },
    {
      id: "average-duration",
      title: "Avg Duration (30D)",
      information: formatDurationMinutes(data.averageDurationMinutes),
      color: "var(--color-sf-text)",
    },
    {
      id: "mttr",
      title: "MTTR (30D)",
      information: formatDurationMinutes(data.mttrMinutes),
      color: "var(--color-sf-text)",
    },
  ];

  return (
    <section className="w-full">
      <div className="mb-3">
        <h2 className="text-sm font-semibold text-sf-text">Incident summary</h2>
        <p className="mt-1 text-[11px] text-sf-text-muted">
          Reliability and recovery metrics for the last 30 days
        </p>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {incidentStats.map((incident) => (
          <IncidentStatCard
            key={incident.id}
            title={incident.title}
            information={incident.information}
            color={incident.color}
          />
        ))}
      </div>
    </section>
  );
};

export default IncidentStats;
