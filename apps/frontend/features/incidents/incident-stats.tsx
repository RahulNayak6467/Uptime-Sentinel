"use client";
import { formatDurationMinutes } from "@/utils/format-duration-minutes";
import { useIncidentsStatsCard } from "./hooks/useIncidentsStatsCard";
import IncidentStatCard from "./incident-stat-card";

const IncidentStats = () => {
  const { data, isLoading, isError } = useIncidentsStatsCard();

  if (isLoading) {
    return (
      <div className="mt-6 w-full px-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="min-h-24 animate-pulse rounded-lg border border-sf-border bg-sf-surface"
            />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <p className="mt-6 px-6 text-sm text-sf-red">
        Unable to load incident statistics.
      </p>
    );
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
    <div className="mt-6 w-full px-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {incidentStats.map((incident) => (
          <IncidentStatCard
            key={incident.id}
            title={incident.title}
            information={incident.information}
            color={incident.color}
          />
        ))}
      </div>
    </div>
  );
};

export default IncidentStats;
