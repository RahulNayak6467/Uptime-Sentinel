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
    <section className="overflow-hidden rounded-xl border border-sf-red-border bg-sf-surface shadow-[0_1px_2px_rgba(220,38,38,0.05)]">
      <div className="flex items-center justify-between border-b border-sf-red-border bg-sf-red-bg px-5 py-2.5">
        <div className="flex items-center gap-2 text-xs font-semibold text-sf-red">
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-sf-red opacity-30" />
            <span className="relative inline-flex size-2.5 rounded-full bg-sf-red" />
          </span>
          Active incident
        </div>
        <span className="flex items-center gap-1.5 font-mono text-xs text-sf-red">
          <Clock className="size-3.5" />
          {formatIncidentDuration(incident.startedAt, incident.resolvedAt)}
        </span>
      </div>

      <div className="flex items-center justify-between gap-8 px-5 py-4">
        <div className="flex min-w-0 items-start gap-3">
          <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg border border-sf-red-border bg-sf-red-bg">
            <TriangleAlert className="size-4 text-sf-red" />
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
          className="shrink-0 rounded-sf-sm border border-sf-red px-3 py-1.5 text-xs font-semibold text-sf-red transition-colors hover:bg-sf-red hover:text-white"
        >
          Open incident
        </Link>
      </div>
    </section>
  );
};

export default IncidentAlert;
