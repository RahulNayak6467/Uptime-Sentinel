"use client";

import { useMemo, useState } from "react";
import { incidentListData } from "./data";
import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Filter,
  RotateCcw,
} from "lucide-react";
import {
  IncidentListItemProps,
  IncidentStatus,
  IncidentUpdateStatus,
} from "./types";
import IncidentUpdateModal from "./components/incident-update-modal";

const statusConfig = {
  active: {
    dot: "bg-sf-red",
    badge: "bg-sf-red-bg text-sf-red border border-sf-red/30",
    label: "Active",
  },
  resolved: {
    dot: "bg-sf-green",
    badge: "bg-sf-green-bg text-sf-green border border-sf-green/30",
    label: "Resolved",
  },
};

const updateConfig: Record<
  IncidentUpdateStatus,
  { dot: string; text: string; label: string }
> = {
  detected: { dot: "bg-sf-red", text: "text-sf-red", label: "Detected" },
  investigating: {
    dot: "bg-amber-400",
    text: "text-amber-400",
    label: "Investigating",
  },
  monitoring: {
    dot: "bg-blue-400",
    text: "text-blue-400",
    label: "Monitoring",
  },
  resolved: {
    dot: "bg-sf-green",
    text: "text-sf-green",
    label: "Resolved",
  },
};

const IncidentRow = ({
  title,
  status,
  service,
  date,
  time,
  duration,
  description,
  endpoint,
  startedAt,
  resolvedAt,
  triggerLabel,
  triggerValue,
  updates,
  expanded,
  onAddDetails,
}: Omit<IncidentListItemProps, "id" | "occurredAt"> & {
  onAddDetails: () => void;
}) => {
  const config = statusConfig[status];

  return (
    <details
      className="group overflow-hidden rounded-lg border border-sf-border bg-sf-surface shadow-sm transition-colors open:border-sf-text-muted/50"
      open={expanded}
    >
      <summary className="flex cursor-pointer list-none gap-3 px-5 py-4 transition-colors hover:bg-sf-border-faint/60 [&::-webkit-details-marker]:hidden">
        <span className={`mt-[5px] h-2 w-2 shrink-0 rounded-full shadow-[0_0_0_3px_var(--color-sf-surface)] ${config.dot}`} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {title ? (
              <span className="font-sans text-[14px] font-bold text-sf-text">
                {title}
              </span>
            ) : (
              <span className="font-sans text-[14px] font-bold italic text-sf-text-muted">
                Untitled incident
              </span>
            )}
            <span className={`rounded-full px-1.5 py-px font-sans text-[10px] font-semibold ${config.badge}`}>
              {config.label}
            </span>
          </div>
          <p className="font-sans text-[12px] text-sf-text-muted">
            {service} · {date} · {time} · {duration}
          </p>
          {description ? (
            <p className="mt-1 font-sans text-[12px] leading-5 text-sf-text-sub">
              {description}
            </p>
          ) : (
            <p className="mt-1 font-sans text-[12px] italic leading-5 text-sf-text-muted">
              No details added yet —{" "}
              <button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  onAddDetails();
                }}
                className="not-italic font-medium text-sf-text-sub underline underline-offset-2 hover:text-sf-text"
              >
                Add details
              </button>
            </p>
          )}
        </div>
        <ChevronDown className="mt-1 h-4 w-4 shrink-0 text-sf-text-muted transition-transform group-open:rotate-180" />
      </summary>

      <div className="border-t border-sf-border px-5 pb-6 pt-5 sm:px-12">
          <div className="mb-5 grid overflow-hidden rounded-sf border border-sf-border bg-sf-bg/70 sm:grid-cols-3">
            <div className="sm:col-span-3">
              <div className="border-b border-sf-border px-3 py-2.5">
              <p className="font-sans text-[10px] font-semibold uppercase tracking-wide text-sf-text-muted">
                Affected endpoint
              </p>
              <a
                href={endpoint}
                target="_blank"
                rel="noreferrer"
                className="mt-0.5 flex items-center gap-1 font-mono text-[11px] text-sf-text-sub hover:text-sf-text"
              >
                <span className="truncate">{endpoint}</span>
                <ExternalLink className="h-3 w-3 shrink-0" />
              </a>
              </div>
            </div>
            <div className="border-b border-sf-border px-3 py-2.5 sm:border-b-0 sm:border-r">
              <p className="font-sans text-[10px] font-semibold uppercase tracking-wide text-sf-text-muted">
                Started
              </p>
              <p className="mt-0.5 font-sans text-[11px] text-sf-text-sub">{startedAt}</p>
            </div>
            <div className="border-b border-sf-border px-3 py-2.5 sm:border-b-0 sm:border-r">
              <p className="font-sans text-[10px] font-semibold uppercase tracking-wide text-sf-text-muted">
                Resolved
              </p>
              <p className="mt-0.5 font-sans text-[11px] text-sf-text-sub">
                {resolvedAt ?? "Ongoing"}
              </p>
            </div>
            <div className="px-3 py-2.5">
              <p className="font-sans text-[10px] font-semibold uppercase tracking-wide text-sf-text-muted">
                {triggerLabel}
              </p>
              <p className="mt-0.5 font-sans text-[11px] font-medium text-sf-text">{triggerValue}</p>
            </div>
          </div>

          <div className="mb-3 flex items-center justify-between">
            <p className="font-sans text-[10px] font-semibold uppercase tracking-wide text-sf-text-muted">
              Incident timeline
            </p>
            <span className="font-sans text-[10px] text-sf-text-muted">
              {updates?.length ?? 0} {(updates?.length ?? 0) === 1 ? "event" : "events"}
            </span>
          </div>
          {updates && updates.length > 0 ? (
            <ol>
            {updates.map((update, index) => {
            const updateStyle = updateConfig[update.status];

            return (
              <li key={update.id} className="relative flex gap-4 pb-5 last:pb-0">
                {index < updates.length - 1 && (
                  <span className="absolute left-[3.5px] top-2 h-full w-px bg-sf-border" />
                )}
                <span className={`relative z-10 mt-1 h-2 w-2 shrink-0 rounded-full ring-2 ring-sf-surface ${updateStyle.dot}`} />
                <div className="min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className={`font-sans text-[13px] font-semibold ${updateStyle.text}`}>
                      {updateStyle.label}
                    </span>
                    <time className="font-mono text-[12px] text-sf-text-muted">
                      {update.time}
                    </time>
                  </div>
                  <p className="mt-1 font-sans text-[12px] leading-5 text-sf-text-sub">
                    {update.message}
                  </p>
                </div>
              </li>
            );
            })}
            </ol>
          ) : (
            <p className="rounded-sf border border-dashed border-sf-border px-3 py-4 text-center font-sans text-[12px] text-sf-text-muted">
              No timeline updates recorded.
            </p>
          )}
        </div>
    </details>
  );
};

const IncidentList = () => {
  const [statusFilter, setStatusFilter] = useState<"all" | IncidentStatus>("all");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [dateRange, setDateRange] = useState("30");
  const [updateTarget, setUpdateTarget] = useState<{
    service: string;
    status: IncidentStatus;
  } | null>(null);

  const services = [...new Set(incidentListData.map((incident) => incident.service))];
  const filteredIncidents = useMemo(
    () =>
      incidentListData.filter(
        (incident) =>
          (statusFilter === "all" || incident.status === statusFilter) &&
          (serviceFilter === "all" || incident.service === serviceFilter) &&
          new Date(incident.occurredAt) >=
            new Date(new Date("2026-06-15T23:59:59").getTime() - Number(dateRange) * 86_400_000),
      ),
    [dateRange, serviceFilter, statusFilter],
  );

  const hasActiveFilters = statusFilter !== "all" || serviceFilter !== "all" || dateRange !== "30";
  const resetFilters = () => {
    setStatusFilter("all");
    setServiceFilter("all");
    setDateRange("30");
  };

  const selectClass =
    "h-8 rounded-sf border border-sf-border bg-sf-bg px-2.5 font-sans text-[12px] text-sf-text-sub outline-none transition-colors hover:border-sf-text-sub focus:border-sf-text-sub";

  return (
    <div className="mt-8 w-full px-6 pb-4">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="font-sans text-[15px] font-bold text-sf-text">
            Incident history
          </h2>
          <p className="mt-1 font-sans text-[12px] text-sf-text-muted">
            Review outages, recovery details, and timeline updates.
          </p>
        </div>
        <div className="flex items-center gap-1.5 font-sans text-[11px] text-sf-text-muted">
          <CalendarDays className="h-3.5 w-3.5" />
          {filteredIncidents.length} {filteredIncidents.length === 1 ? "incident" : "incidents"}
        </div>
      </div>

      <div className="mb-5 rounded-lg border border-sf-border bg-sf-surface p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-2 flex items-center gap-1.5 font-sans text-[11px] font-semibold uppercase tracking-wide text-sf-text-muted">
            <Filter className="h-3.5 w-3.5" />
            Filters
          </span>
          <select
            aria-label="Filter incidents by status"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as "all" | IncidentStatus)}
            className={selectClass}
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="resolved">Resolved</option>
          </select>
          <select
            aria-label="Filter incidents by service"
            value={serviceFilter}
            onChange={(event) => setServiceFilter(event.target.value)}
            className={selectClass}
          >
            <option value="all">All monitors</option>
            {services.map((service) => (
              <option key={service} value={service}>{service}</option>
            ))}
          </select>
          <select
            aria-label="Filter incidents by date"
            value={dateRange}
            onChange={(event) => setDateRange(event.target.value)}
            className={`${selectClass} sm:ml-auto`}
          >
            <option value="30">Last 30 days</option>
            <option value="7">Last 7 days</option>
            <option value="90">Last 90 days</option>
          </select>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="flex h-8 items-center gap-1.5 rounded-sf px-2 font-sans text-[11px] font-medium text-sf-text-muted transition-colors hover:bg-sf-border-faint hover:text-sf-text"
            >
              <RotateCcw className="h-3 w-3" />
              Reset
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {filteredIncidents.map((incident) => (
          <IncidentRow
            key={incident.id}
            title={incident.title}
            status={incident.status}
            service={incident.service}
            date={incident.date}
            time={incident.time}
            duration={incident.duration}
            description={incident.description}
            endpoint={incident.endpoint}
            startedAt={incident.startedAt}
            resolvedAt={incident.resolvedAt}
            triggerLabel={incident.triggerLabel}
            triggerValue={incident.triggerValue}
            updates={incident.updates}
            expanded={incident.expanded}
            onAddDetails={() =>
              setUpdateTarget({
                service: incident.service,
                status: incident.status,
              })
            }
          />
        ))}

        {filteredIncidents.length === 0 && (
          <div className="rounded-lg border border-dashed border-sf-border bg-sf-surface px-4 py-14 text-center">
            <p className="font-sans text-[13px] font-semibold text-sf-text">No incidents found</p>
            <p className="mt-1 font-sans text-[12px] text-sf-text-muted">
              Try changing the selected filters.
            </p>
          </div>
        )}
      </div>

        <div className="mt-5 flex items-center justify-between rounded-lg border border-sf-border bg-sf-surface px-4 py-3">
          <p className="font-sans text-[11px] text-sf-text-muted">
            Showing {filteredIncidents.length} of {incidentListData.length} incidents
          </p>
          <div className="flex items-center gap-1.5">
            <button disabled aria-label="Previous page" className="rounded-sf border border-sf-border p-1 text-sf-text-muted disabled:opacity-40">
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <span className="px-2 font-sans text-[11px] text-sf-text-sub">Page 1 of 1</span>
            <button disabled aria-label="Next page" className="rounded-sf border border-sf-border p-1 text-sf-text-muted disabled:opacity-40">
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
      </div>

      <IncidentUpdateModal
        open={updateTarget !== null}
        onClose={() => setUpdateTarget(null)}
        service={updateTarget?.service ?? ""}
        overallStatus={updateTarget?.status ?? "active"}
      />
    </div>
  );
};

export default IncidentList;
