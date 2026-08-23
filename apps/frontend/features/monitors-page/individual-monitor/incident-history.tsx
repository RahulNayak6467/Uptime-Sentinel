import { useLastFiveIncidentsData } from "./hooks/useLastFiveIncidents";
import { formatIncidentDuration } from "@/utils/format-incident-duration";
import { formatIncidentTimestamp } from "@/utils/format-incident-timestamp";
import {
  IncidentHistoryEmpty,
  IncidentHistoryError,
  IncidentHistorySkeleton,
} from "./incident-history-states";

// const incidents = [
//   {
//     id: "incident-preview-1",
//     isActive: true,
//     title: "Service unavailable",
//     startedAt: "Today · 10:42 AM",
//     duration: "18m ongoing",
//     trigger: "HTTP 503",
//     recovery: null,
//   },
//   {
//     id: "incident-preview-2",
//     isActive: false,
//     title: "Request timeout",
//     startedAt: "Jul 4, 2026 · 8:16 PM",
//     duration: "12m 34s",
//     trigger: "Timeout",
//     recovery: "Recovered 8:29 PM",
//   },
//   {
//     id: "incident-preview-3",
//     isActive: false,
//     title: "Server error",
//     startedAt: "Jun 28, 2026 · 2:05 AM",
//     duration: "3m 08s",
//     trigger: "HTTP 500",
//     recovery: "Recovered 2:08 AM",
//   },
// ] as const;

const IncidentHistory = ({ id }: { id: string }) => {
  const {
    data: lastFiveIncidents,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useLastFiveIncidentsData(id);

  if (isLoading) {
    return <IncidentHistorySkeleton />;
  }

  if (isError || !lastFiveIncidents) {
    return (
      <IncidentHistoryError
        onRetry={() => void refetch()}
        isRetrying={isFetching}
      />
    );
  }


  const requiredData = lastFiveIncidents.data.map((data) => {
    return {
      id: data.id,
      isActive: data.is_active,
      title: data.title?.trim() || "Endpoint outage",
      startedAt: formatIncidentTimestamp(data.started_at).dateTime,
      duration: formatIncidentDuration(
        data.started_at,
        data.resolved_at,
      ).replace(/^lasted /, ""),
      trigger: "HTTP 500",
      recovery: data.resolved_at
        ? `Recovered ${formatIncidentTimestamp(data.resolved_at).dateTime}`
        : null,
    };
  });

  return (
    <section
      id="incidents"
      className="sf-panel scroll-mt-16 p-5 pb-6 shadow-sm"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div>
          <h3 className="text-base font-semibold tracking-tight text-sf-text">
            Recent Incident History
          </h3>
          <p className="mt-1 text-xs text-sf-text-muted">
            Outages and recoveries for this endpoint
          </p>
        </div>
        <span className="shrink-0 rounded-sf border border-sf-border bg-sf-bg px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-sf-text-muted">
          Preview
        </span>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-sf-text-muted">
        <span className="flex items-center gap-1.5">
          <i className="size-1.5 rounded-full bg-sf-red" />
          {lastFiveIncidents.activeCount} active
        </span>
        <span className="flex items-center gap-1.5">
          <i className="size-1.5 rounded-full bg-sf-green" />
          {lastFiveIncidents.resolvedCount} resolved
        </span>
      </div>

      {requiredData.length === 0 ? (
        <IncidentHistoryEmpty />
      ) : (
        <div className="mt-4 overflow-hidden rounded-lg border border-sf-border bg-sf-surface">
          {requiredData.map((incident, index) => (
            <article
              key={incident.id}
              className={`grid gap-4 px-4 py-3.5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center ${
                index > 0 ? "border-t border-sf-border" : ""
              } ${incident.isActive ? "bg-sf-red-bg/20" : ""}`}
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`size-2 shrink-0 rounded-full ${
                      incident.isActive ? "bg-sf-red" : "bg-sf-green"
                    }`}
                    aria-hidden="true"
                  />
                  <p className="text-[13px] font-semibold leading-5 text-sf-text">
                    {incident.title}
                  </p>
                  <span
                    className={`rounded-sf border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.08em] ${
                      incident.isActive
                        ? "border-sf-red-border bg-sf-red-bg text-sf-red"
                        : "border-sf-green-border bg-sf-green-bg text-sf-green"
                    }`}
                  >
                    {incident.isActive ? "Active" : "Resolved"}
                  </span>
                </div>

                <p className="mt-1 text-[11px] leading-5 text-sf-text-muted">
                  Started {incident.startedAt}
                  <span className="text-sf-border-faint"> · </span>
                  <span className="font-medium text-sf-text-sub">
                    {incident.trigger}
                  </span>
                  {incident.recovery ? (
                    <>
                      <span className="text-sf-border-faint"> · </span>
                      {incident.recovery}
                    </>
                  ) : (
                    <>
                      <span className="text-sf-border-faint"> · </span>
                      <span className="font-medium text-sf-red">Ongoing</span>
                    </>
                  )}
                </p>
              </div>

              <div className="sm:text-right">
                <p className="font-mono text-[13px] font-medium tabular-nums text-sf-text-sub">
                  {incident.duration}
                </p>
                <p className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.12em] text-sf-text-muted">
                  Duration
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default IncidentHistory;
