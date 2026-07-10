"use client";
import { CheckCircle2, ChevronDown, ExternalLink } from "lucide-react";
import {
  IncidentListItemProps,
  IncidentUpdate,
  IncidentUpdateStatus,
} from "./types";
import { useAllIncidentsData } from "./hooks/useAllIncidentsData";
import IncidentsPagination from "./components/incidents-pagination";
import IncidentUpdateModal from "./components/incident-update-modal";
import IncidentListSkeleton from "./components/incident-list-skeleton";
import IncidentListError from "./components/incident-list-error";
import { useState } from "react";
import { INCIDENT_PAGE_LIMIT } from "@/constants/constant";
import { FetchingIndicator } from "@/components/ui/fetching-indicator";
import { formatIncidentTimestamp } from "@/utils/format-incident-timestamp";
import { formatIncidentDuration } from "@/utils/format-incident-duration";
import { useIncidentsTimeline } from "./hooks/useIncidentsTimeline";
import { getAvailableIncidentUpdateStatuses } from "./incident-update-flow";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const UPDATE_META: Record<
  IncidentUpdateStatus,
  { label: string; dot: string; text: string }
> = {
  detected: { label: "Detected", dot: "bg-sf-red", text: "text-sf-red" },
  investigating: {
    label: "Investigating",
    dot: "bg-sf-amber",
    text: "text-sf-amber",
  },
  monitoring: { label: "Monitoring", dot: "bg-sf-blue", text: "text-sf-blue" },
  resolved: { label: "Resolved", dot: "bg-sf-green", text: "text-sf-green" },
};

type IncidentDetailsCardProps = {
  incident: IncidentListItemProps;
  onAddDetails: () => void;
  onEditUpdate: (update: IncidentUpdate) => void;
};

const IncidentDetailsCard = ({
  incident,
  onAddDetails,
  onEditUpdate,
}: IncidentDetailsCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const isActive = incident.status === "active";
  const updates = incident.updates ?? [];
  const hasUserDetails =
    Boolean(incident.description?.trim()) ||
    updates.some((update) => Boolean(update.message?.trim()));
  const canAddDetails =
    getAvailableIncidentUpdateStatuses(incident.status, updates).length > 0;

  return (
    <div
      className={`overflow-hidden rounded-lg border border-sf-border bg-sf-surface shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition-colors hover:border-sf-text-muted/50 ${
        isActive ? "border-l-2 border-l-sf-red" : ""
      }`}
    >
      <div
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        aria-controls={`${incident.id}-content`}
        onClick={() => setIsOpen((open) => !open)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setIsOpen((open) => !open);
          }
        }}
        className="flex cursor-pointer flex-col gap-3 px-4 py-4 transition-colors hover:bg-sf-bg/45 sm:flex-row sm:items-start sm:px-5"
      >
        <div className="flex w-full min-w-0 items-start gap-3 sm:flex-1">
          <span
            className={`mt-1.5 size-2 shrink-0 rounded-full ${isActive ? "bg-sf-red" : "bg-sf-green"}`}
          />
          <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2
              className={`text-[14px] font-semibold tracking-sf-tight ${
                incident.title ? "text-sf-text" : "italic text-sf-text-sub"
              }`}
            >
              {incident.title ?? "Untitled incident"}
            </h2>
            <span
              className={`rounded-sf border px-2 py-0.5 text-xs font-semibold ${
                isActive
                  ? "border-sf-red/30 bg-sf-red-bg text-sf-red"
                  : "border-sf-green/30 bg-sf-green-bg text-sf-green"
              }`}
            >
              {isActive ? "Active" : "Resolved"}
            </span>
          </div>

          <p className="mt-1 text-xs text-sf-text-muted">
            <span className="font-medium text-sf-text-sub">
              {incident.service}
            </span>{" "}
            · {incident.date} · {incident.time}
          </p>

          {incident.status === "active" &&
          !hasUserDetails ? (
            <p className="mt-2 text-xs italic text-sf-text-muted">
              No details added yet —{" "}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onAddDetails();
                }}
                className="cursor-pointer rounded px-1 py-0.5 font-semibold not-italic text-sf-text-sub underline decoration-sf-border underline-offset-2 transition-colors hover:bg-sf-border-faint hover:text-sf-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sf-text/20"
              >
                Add details
              </button>
            </p>
          ) : null}
          </div>
        </div>

        <div className="flex w-full items-center justify-between gap-3 pl-5 sm:ml-4 sm:w-auto sm:flex-col sm:items-end sm:justify-start sm:pl-0 sm:text-right">
          <p className="font-mono text-xs font-medium text-sf-text-sub">{incident.duration}</p>
          <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-sf-text-muted">Duration</p>
        </div>

        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.18, ease: "easeOut" }}
          className="mt-1 flex shrink-0 text-sf-text-muted"
        >
          <ChevronDown className="size-4" />
        </motion.span>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`${incident.id}-content`}
            initial={reduceMotion ? { opacity: 1 } : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduceMotion ? { opacity: 1 } : { height: 0, opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2, ease: "easeOut" }}
            className="overflow-hidden"
          >
      <div className="border-t border-sf-border bg-sf-bg/35 p-4 sm:p-5">
        <div className="grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="self-start overflow-hidden rounded-lg border border-sf-border bg-sf-surface">
          <div className="flex items-center justify-between border-b border-sf-border px-5 py-3.5">
            <div className="flex items-center gap-2">
              <span className={`size-2 rounded-full ${isActive ? "bg-sf-red" : "bg-sf-green"}`} />
              <h3 className="text-sm font-semibold text-sf-text">Incident context</h3>
            </div>
            <span className={`rounded-sf border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${isActive ? "border-sf-red-border bg-sf-red-bg text-sf-red" : "border-sf-green-border bg-sf-green-bg text-sf-green"}`}>
              {isActive ? "Active" : "Resolved"}
            </span>
          </div>
          <div className="border-b border-sf-border px-5 py-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-sf-text-muted">
              Affected endpoint
            </p>
            <a
              href={incident.endpoint}
              target="_blank"
              rel="noreferrer"
              className="mt-2 flex items-center gap-1.5 font-mono text-[12px] font-medium text-sf-text hover:text-sf-blue"
            >
              <span className="truncate">{incident.endpoint}</span>
              <ExternalLink className="size-3 shrink-0" />
            </a>
          </div>

          <div>
            <IncidentField label="Started" value={incident.startedAtDisplay} />
            <IncidentField
              label="Resolved"
              value={incident.resolvedAt ?? "Ongoing"}
              bordered
            />
            <IncidentField
              label={incident.triggerLabel}
              value={incident.triggerValue}
              bordered
            />
          </div>
        </aside>

        <div className="min-w-0 rounded-lg border border-sf-border bg-sf-surface p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <p className="text-sm font-semibold text-sf-text">
            Incident timeline
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs text-sf-text-muted">
              {updates.length} {updates.length === 1 ? "event" : "events"}
            </span>
            {canAddDetails && (
              <button
                type="button"
                onClick={onAddDetails}
                className="cursor-pointer rounded-[4px] border border-sf-text bg-sf-text px-3 py-1.5 text-xs font-semibold text-sf-btn-text shadow-sm transition-[background-color,border-color,box-shadow,transform] duration-150 hover:-translate-y-px hover:border-sf-btn-hover hover:bg-sf-btn-hover hover:shadow-md active:translate-y-0 active:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sf-text/25 focus-visible:ring-offset-2 focus-visible:ring-offset-sf-surface"
              >
                Add details
              </button>
            )}
          </div>
        </div>

        {updates.length === 0 ? (
          <p className="mt-3 rounded-md border border-dashed border-sf-border py-5 text-center text-xs text-sf-text-muted">
            No timeline updates recorded.
          </p>
        ) : (
          <ol className="mt-4">
            {updates.map((update, index) => {
              const meta = UPDATE_META[update.type];
              const timestamp = formatIncidentTimestamp(update.occurred_at);
              const occurredOnDifferentDay = timestamp.date !== incident.date;
              const isLastUpdate = index === updates.length - 1;
              return (
                <li
                  key={update.id}
                  className="group/update relative grid grid-cols-[10px_minmax(0,1fr)] gap-x-3 pb-4 last:pb-0"
                >
                  {!isLastUpdate && (
                    <span
                      aria-hidden="true"
                      className="absolute -bottom-[9px] left-[4.5px] top-[9px] w-px bg-sf-border"
                    />
                  )}
                  <span
                    aria-hidden="true"
                    className={`relative z-10 mt-1 size-2.5 rounded-full ring-4 ring-sf-surface ${meta.dot}`}
                  />
                  <div className="min-w-0">
                    <div className="flex min-h-5 -translate-y-0.5 flex-wrap items-baseline gap-2.5">
                      <span className={`text-sm font-semibold ${meta.text}`}>
                        {meta.label}
                      </span>
                      <span className="font-mono text-xs tracking-wide text-sf-text-muted">
                        {occurredOnDifferentDay
                          ? `${timestamp.date} · ${timestamp.time}`
                          : timestamp.time}
                      </span>
                      <button
                        type="button"
                        onClick={() => onEditUpdate(update)}
                        className="ml-auto cursor-pointer rounded-[4px] border border-transparent px-2 py-1 text-xs font-medium text-sf-text-muted transition-colors duration-150 hover:border-sf-border hover:bg-sf-border-faint hover:text-sf-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sf-text/20"
                      >
                        Edit
                      </button>
                    </div>
                    <p className="mt-1 text-sm leading-5 text-sf-text-muted">
                      {update.message ?? "No details added for this stage."}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
        </div>
        </div>
      </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const IncidentField = ({
  label,
  value,
  bordered = false,
}: {
  label: string;
  value: string;
  bordered?: boolean;
}) => (
  <div
    className={`px-5 py-4 ${bordered ? "border-t border-sf-border" : ""}`}
  >
    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-sf-text-muted">
      {label}
    </p>
    <p className="mt-1.5 text-[12px] font-semibold text-sf-text">{value}</p>
  </div>
);

const IncidentList = () => {
  const reduceMotion = useReducedMotion();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [modalTarget, setModalTarget] = useState<{
    incident: IncidentListItemProps;
    editUpdate?: IncidentUpdate;
  } | null>(null);
  const {
    data: allIncidentData,
    isLoading: allIncidentDataLoading,
    isFetching,
    isError: allIncidentDataError,
    refetch,
  } = useAllIncidentsData(INCIDENT_PAGE_LIMIT, currentPage);

  const {
    data: incidentTimelineData,
    isLoading: incidentTimelineLoading,
    isError: incidentTimelineError,
  } = useIncidentsTimeline(INCIDENT_PAGE_LIMIT, currentPage);
  const isPageFetching = isFetching && !allIncidentDataLoading;

  if (allIncidentDataLoading || incidentTimelineLoading) {
    return <IncidentListSkeleton rows={INCIDENT_PAGE_LIMIT} />;
  }

  if (
    allIncidentDataError ||
    !allIncidentData ||
    incidentTimelineError ||
    !incidentTimelineData
  ) {
    return <IncidentListError onRetry={() => refetch()} />;
  }

  const { totalPage } = allIncidentData?.pagination;

  const timelinePropsMap = new Map();

  const timelineData = incidentTimelineData.data;

  for (const item of timelineData) {
    timelinePropsMap.set(item.incident_id, {
      updates: item.updates,
      title: item.title,
    });
  }

  const requiredData: IncidentListItemProps[] = allIncidentData.data.map(
    (el) => {
      const started = formatIncidentTimestamp(el.startedAt);

      return {
        title: timelinePropsMap.get(el.id)?.title,
        id: `incidents-details-id-${el.id}`,
        incidentId: el.id,
        status: el.isActive ? "active" : "resolved",
        service: el.urlName,
        date: started.date,
        startedAtRaw: String(el.startedAt),
        time: started.time,
        duration: formatIncidentDuration(el.startedAt, el.resolvedAt),
        endpoint: el.url,
        startedAtDisplay: started.dateTime,
        resolvedAt: el.resolvedAt
          ? formatIncidentTimestamp(el.resolvedAt).dateTime
          : undefined,
        triggerLabel: "HTTP status",
        triggerValue: "503",
        expanded: false,
        updates: timelinePropsMap.get(el.id)?.updates ?? [],
      };
    },
  );

  // console.log(requiredData);
  const activeCount = requiredData.filter((incident) => incident.status === "active").length;

  return (
    <section className="relative" aria-busy={isPageFetching}>
      <FetchingIndicator
        active={isPageFetching}
        label="Loading incident page"
      />
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
        <div>
          <h2 className="text-[14px] font-semibold tracking-sf-tight text-sf-text">Incident history</h2>
          <p className="mt-1 text-xs text-sf-text-muted">Detection, investigation, monitoring, and recovery events</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs text-sf-text-muted">
          <span className="flex items-center gap-1.5"><i className="size-1.5 rounded-full bg-sf-red" />{activeCount} active</span>
          <span className="flex items-center gap-1.5"><i className="size-1.5 rounded-full bg-sf-green" />{requiredData.length - activeCount} resolved</span>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {requiredData.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-sf-border bg-sf-surface px-6 py-12 text-center shadow-sm">
            <span className="flex size-10 items-center justify-center rounded-lg border border-sf-border bg-sf-bg text-sf-green">
              <CheckCircle2 className="size-[18px]" />
            </span>
            <h3 className="mt-4 text-sm font-semibold text-sf-text">
              No incidents recorded
            </h3>
            <p className="mt-1.5 max-w-sm text-xs leading-5 text-sf-text-muted">
              Outages and recovery events will appear here when a monitor changes state.
            </p>
          </div>
        ) : (
          requiredData.map((data, index) => (
          <motion.div
            key={data.id}
            initial={reduceMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: reduceMotion ? 0 : 0.2,
              delay: reduceMotion ? 0 : Math.min(index * 0.035, 0.14),
              ease: "easeOut",
            }}
          >
            <IncidentDetailsCard
              incident={data}
              onAddDetails={() => setModalTarget({ incident: data })}
              onEditUpdate={(update) =>
                setModalTarget({ incident: data, editUpdate: update })
              }
            />
          </motion.div>
          ))
        )}
      </div>
      {totalPage > 1 ? (
        <IncidentsPagination
          totalPage={totalPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      ) : null}
      {modalTarget && (
        <IncidentUpdateModal
          open
          onClose={() => setModalTarget(null)}
          incidentId={modalTarget.incident.incidentId}
          service={modalTarget.incident.service}
          overallStatus={modalTarget.incident.status}
          startedAt={new Date(modalTarget.incident.startedAtRaw)}
          updates={modalTarget.incident.updates ?? []}
          existingTitle={modalTarget.incident.title}
          editUpdate={modalTarget.editUpdate}
        />
      )}
    </section>
  );
};

export default IncidentList;
