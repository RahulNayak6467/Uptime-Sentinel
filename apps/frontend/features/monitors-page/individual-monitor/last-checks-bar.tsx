"use client";

import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import Error from "../../Overview/components/error";
import MonitorUnchecked from "./monitor-unchecked";
import CheckTooltip from "./check-tooltip";
import { useLastChecks } from "./hooks/useLastChecks";
import { Panel } from "./monitor-detail-primitives";

const LastChecksSkeleton = () => (
  <div role="status" aria-busy="true" className="sf-panel p-5">
    <div className="flex items-center justify-between">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-3 w-24" />
    </div>
    <div className="mt-4 grid grid-cols-[repeat(30,minmax(2px,1fr))] gap-1 sm:grid-cols-[repeat(60,minmax(2px,1fr))] xl:grid-cols-[repeat(90,minmax(2px,1fr))]">
      {Array.from({ length: 90 }, (_, index) => (
        <Skeleton key={index} className="h-8 w-full rounded-[2px]" />
      ))}
    </div>
  </div>
);

export const LastChecksBar = () => {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { data, isLoading, isError, refetch } = useLastChecks(id);

  if (isLoading) return <LastChecksSkeleton />;

  if (isError || !data) {
    return <Error refetch={refetch} />;
  }

  if (data.data.state === "UNCHECKED") {
    return <MonitorUnchecked />;
  }

  const dataChecks = data.data.checks.toReversed().map((check) => ({
    ...check,
    isUp: check.current_status === "UP",
  }));
  const upCount = dataChecks.filter((check) => check.isUp).length;
  const uptimePct = dataChecks.length
    ? Math.round((upCount / dataChecks.length) * 100)
    : null;

  return (
    <Panel>
      <div className="flex items-start justify-between gap-4 border-b border-sf-border px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold tracking-sf-tight text-sf-text">
            Recent checks
          </h2>
          <p className="mt-1 text-xs text-sf-text-muted">
            Latest {dataChecks.length} check results, oldest to newest
          </p>
        </div>
        {uptimePct !== null ? (
          <div className="text-right">
            <p className="text-sm font-semibold tabular-nums text-sf-text">
              {uptimePct}%
            </p>
            <p className="mt-0.5 text-xs text-sf-text-muted">
              {upCount}/{dataChecks.length} successful
            </p>
          </div>
        ) : null}
      </div>

      <div className="p-5">
        <div
          className="grid gap-1"
          style={{
            gridTemplateColumns: `repeat(${Math.max(dataChecks.length, 1)}, minmax(3px, 1fr))`,
          }}
        >
          {dataChecks.map((check) => (
            <div
              key={`${check.checked_at}-${id}`}
              className={`group relative h-9 rounded-[2px] transition-[filter,transform] duration-150 hover:-translate-y-0.5 hover:brightness-110 ${
                check.isUp ? "bg-sf-green" : "bg-sf-red"
              }`}
            >
              <CheckTooltip
                status={check.current_status}
                responseTime={check.response_time}
                checkedAt={check.checked_at}
              />
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-4 text-xs text-sf-text-muted">
          <span className="flex items-center gap-1.5">
            <i className="size-1.5 rounded-full bg-sf-green" /> Successful
          </span>
          <span className="flex items-center gap-1.5">
            <i className="size-1.5 rounded-full bg-sf-red" /> Failed
          </span>
        </div>
      </div>
    </Panel>
  );
};
