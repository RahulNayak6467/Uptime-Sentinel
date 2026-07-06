"use client";

import { useParams } from "next/navigation";
import { MapPin, Shield, Wifi } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Error from "../../Overview/components/error";
import MonitorUnchecked from "./monitor-unchecked";
import CheckTooltip from "./check-tooltip";
import { useLastChecks } from "./hooks/useLastChecks";
import { RegionalLatencyStats } from "./data";

const LastChecksSkeleton = () => (
  <div
    role="status"
    aria-busy="true"
    className="rounded-lg border border-sf-border bg-sf-surface p-5 shadow-sm"
  >
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

const LastChecksBar = () => {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { data, isLoading, isError, refetch } = useLastChecks(id);

  if (isLoading) return <LastChecksSkeleton />;

  if (isError || !data) {
    return <Error refetch={refetch} />;
  }

  if (data.state === "UNCHECKED") {
    return <MonitorUnchecked />;
  }

  const dataChecks = data.checks.toReversed().map((check) => ({
    ...check,
    isUp: check.current_status === "UP",
  }));
  const upCount = dataChecks.filter((check) => check.isUp).length;
  const uptimePct = dataChecks.length
    ? Math.round((upCount / dataChecks.length) * 100)
    : null;

  return (
    <section className="overflow-hidden rounded-lg border border-sf-border bg-sf-surface shadow-sm">
      <div className="flex items-start justify-between gap-4 border-b border-sf-border px-5 py-4">
        <div>
          <h2 className="text-[14px] font-semibold text-sf-text">
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
    </section>
  );
};

const PlannedOverlay = () => (
  <div className="absolute inset-0 z-10 flex items-center justify-center bg-sf-surface/70 backdrop-blur-[2px]">
    <span className="rounded-sf border border-sf-border bg-sf-bg px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-sf-text-muted">
      Coming soon
    </span>
  </div>
);

const SignalCard = ({
  title,
  icon: Icon,
  rows,
}: {
  title: string;
  icon: typeof Shield;
  rows: { label: string; value: string }[];
}) => (
  <section className="relative overflow-hidden rounded-lg border border-sf-border bg-sf-surface shadow-sm">
    <PlannedOverlay />
    <div className="flex items-center gap-2 border-b border-sf-border px-4 py-3">
      <span className="flex size-7 items-center justify-center rounded-md border border-sf-border bg-sf-bg text-sf-text-muted">
        <Icon className="size-3.5" />
      </span>
      <h3 className="text-[13px] font-semibold text-sf-text">{title}</h3>
    </div>
    <dl className="divide-y divide-sf-border">
      {rows.map((row) => (
        <div key={row.label} className="flex items-center justify-between gap-3 px-4 py-2.5">
          <dt className="text-xs text-sf-text-muted">{row.label}</dt>
          <dd className="text-right text-xs font-medium text-sf-text">{row.value}</dd>
        </div>
      ))}
    </dl>
  </section>
);

const RegionalLatencyCard = () => (
  <section className="relative overflow-hidden rounded-lg border border-sf-border bg-sf-surface shadow-sm">
    <PlannedOverlay />
    <div className="flex items-center gap-2 border-b border-sf-border px-4 py-3">
      <span className="flex size-7 items-center justify-center rounded-md border border-sf-border bg-sf-bg text-sf-text-muted">
        <MapPin className="size-3.5" />
      </span>
      <h3 className="text-[13px] font-semibold text-sf-text">Regional latency</h3>
    </div>
    <div className="space-y-2.5 px-4 py-3.5">
      {RegionalLatencyStats.map((region) => {
        const color =
          region.latencyMs <= 150
            ? "var(--color-sf-green)"
            : region.latencyMs <= 220
              ? "var(--color-sf-amber)"
              : "var(--color-sf-red)";
        return (
          <div key={region.id} className="flex items-center gap-3">
            <span className="w-16 shrink-0 text-xs font-medium text-sf-text-muted">
              {region.region}
            </span>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-sf-border">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${Math.min((region.latencyMs / 320) * 100, 100)}%`,
                  backgroundColor: color,
                }}
              />
            </div>
            <span className="w-11 text-right font-mono text-xs" style={{ color }}>
              {region.latency}
            </span>
          </div>
        );
      })}
    </div>
  </section>
);

const CertificatesMonitor = () => (
  <>
    <div id="recent-checks" className="scroll-mt-16">
      <LastChecksBar />
    </div>

    <section id="infrastructure" className="scroll-mt-16">
      <div className="mb-3 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-sf-text">Infrastructure signals</h2>
          <p className="mt-1 text-xs text-sf-text-muted">
            Certificate, DNS, and regional availability context
          </p>
        </div>
        <span className="rounded-sf border border-sf-border bg-sf-bg px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-sf-text-muted">
          Planned
        </span>
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        <SignalCard
          title="SSL certificate"
          icon={Shield}
          rows={[
            { label: "Status", value: "Valid" },
            { label: "Issuer", value: "Let's Encrypt" },
            { label: "Expires", value: "Aug 14, 2026" },
            { label: "Days left", value: "61 days" },
          ]}
        />
        <SignalCard
          title="DNS"
          icon={Wifi}
          rows={[
            { label: "Status", value: "Resolving" },
            { label: "Records tracked", value: "6 records" },
            { label: "Last change", value: "42 days ago" },
            { label: "Monitoring", value: "A · AAAA · CNAME · MX" },
          ]}
        />
        <RegionalLatencyCard />
      </div>
    </section>
  </>
);

export default CertificatesMonitor;
