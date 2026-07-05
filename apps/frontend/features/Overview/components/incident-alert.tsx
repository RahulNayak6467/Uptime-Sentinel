"use client";

import { Clock, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useAllIncidentsData } from "@/features/incidents/hooks/useAllIncidentsData";
import { formatIncidentDuration } from "@/utils/format-incident-duration";
import { formatIncidentTimestamp } from "@/utils/format-incident-timestamp";

const IncidentAlert = () => {
  const { data, isLoading, isError } = useAllIncidentsData(5, 1);
  const incident = data?.data.find((item) => item.isActive);

  if (isLoading || isError || !incident) return null;

  const started = formatIncidentTimestamp(incident.startedAt);

  return (
    <section className="relative overflow-hidden rounded-xl border border-sf-red-border bg-sf-surface shadow-[0_10px_30px_rgba(220,38,38,0.07)]">
      <span className="absolute inset-y-0 left-0 w-1 bg-sf-red" />
      <div className="flex items-center justify-between border-b border-sf-red-border/70 bg-sf-red-bg/70 px-5 py-2.5 pl-6">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-sf-red">
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-sf-red opacity-30" />
            <span className="relative inline-flex size-2.5 rounded-full bg-sf-red" />
          </span>
          Active incident
        </div>
        <span className="flex items-center gap-1.5 font-mono text-[11px] font-medium text-sf-red">
          <Clock className="size-3.5" />
          {formatIncidentDuration(incident.startedAt, incident.resolvedAt)}
        </span>
      </div>

      <div className="flex flex-col items-start justify-between gap-4 px-6 py-4 sm:flex-row sm:items-center sm:gap-8">
        <div className="flex min-w-0 items-start gap-3">
          <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl border border-sf-red-border bg-sf-red-bg text-sf-red shadow-sm">
            <TriangleAlert className="size-4" />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="truncate text-base font-semibold tracking-sf-tight text-sf-text">
                {incident.urlName} is unavailable
              </h2>
              <span className="rounded-full border border-sf-red-border bg-sf-red-bg px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-sf-red">
                HTTP {incident.httpStatus}
              </span>
            </div>
            <p className="mt-1 text-xs text-sf-text-muted">
              Detected {started.dateTime} · Recovery monitoring is active
            </p>
          </div>
        </div>

        <Link
          href="/dashboard/incidents"
          className="shrink-0 rounded-lg border border-sf-red-border bg-sf-red-bg px-3.5 py-2 text-[11px] font-semibold text-sf-red transition-all hover:border-sf-red hover:bg-sf-red hover:text-white"
        >
          Open incident
        </Link>
      </div>
    </section>
  );
};

export default IncidentAlert;
