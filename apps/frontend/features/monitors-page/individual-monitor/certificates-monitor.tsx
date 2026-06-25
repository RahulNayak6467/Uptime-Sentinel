"use client"
import { MapPin, Shield, Wifi } from "lucide-react";
import { RegionMonitorProps } from "./types";
import { RegionalLatencyStats } from "./data";
import {useLastChecks} from "@/features/monitors-page/individual-monitor/hooks/useLastChecks";
import {useParams} from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import Error from "../../Overview/components/error";
import MonitorUnchecked from "./monitor-unchecked";
import {formatChartDate} from "@/utils/format-chart-date";
import CheckTooltip from "@/features/monitors-page/individual-monitor/check-tooltip";

const ComingSoonOverlay = () => (
  <div className="absolute inset-0 bg-sf-surface/70 backdrop-blur-[2px] rounded-sf flex items-center justify-center z-10">
    <span className="text-[11px] font-semibold font-sans px-2.5 py-1 rounded-full border border-sf-border bg-sf-bg text-sf-text-muted tracking-wide">
      Coming soon
    </span>
  </div>
);

const CertificatesMonitor = () => {
  return (
    <>
      <div>
        <LastChecksBar />
      </div>

      <div className="mt-6 flex gap-4">
        <SSLStats />
        <DNSRecords />

        <div className="relative border border-sf-border bg-sf-surface rounded-sf w-full flex flex-col overflow-hidden">
          <ComingSoonOverlay />
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex gap-2 items-center">
              <MapPin className="w-3.5 h-3.5 text-sf-text-muted" />
              <p className="font-sans font-semibold text-sf-text text-[14px]">
                Regional latency
              </p>
            </div>
          </div>

          <div className="flex flex-col px-4 py-2">
            {RegionalLatencyStats.map((region) => (
              <RegionalLatency
                key={region.id}
                region={region.region}
                latency={region.latency}
                latencyMs={region.latencyMs}
              />
            ))}
          </div>

          <div className="px-4 pb-3 flex items-center gap-4 mt-auto">
            <span className="flex items-center gap-1.5 text-[11px] font-sans text-sf-text-muted">
              <span
                style={{ backgroundColor: "var(--color-sf-green)" }}
                className="w-2.5 h-0.5 rounded-full inline-block"
              />
              ≤ 150ms
            </span>

            <span className="flex items-center gap-1.5 text-[11px] font-sans text-sf-text-muted">
              <span
                style={{ backgroundColor: "var(--color-sf-amber)" }}
                className="w-2.5 h-0.5 rounded-full inline-block"
              />
              ≤ 220ms
            </span>

            <span className="flex items-center gap-1.5 text-[11px] font-sans text-sf-text-muted">
              <span
                style={{ backgroundColor: "var(--color-sf-red)" }}
                className="w-2.5 h-0.5 rounded-full inline-block"
              />
              &gt; 220ms
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

const LastChecksSkeleton = () => (
  <div
    role="status"
    aria-busy="true"
    className="mt-6 px-4 py-4 pb-6 bg-sf-surface border border-sf-border rounded-sf"
  >
    <Skeleton className="h-4 w-40" />
    <div className="flex gap-0.5 mt-3">
      {Array.from({ length: 90 }, (_, index) => (
        <Skeleton key={index} className="w-2 h-8 rounded-[2px]" />
      ))}
    </div>
  </div>
);

const LastChecksBar = () => {
  const params = useParams<{id:string }>()
  const id = params.id;

  const {data,isLoading,isError,refetch} = useLastChecks(id)

  if(isLoading){
    return <LastChecksSkeleton />
  }
  if(isError || !data){
    return (
      <div className="mt-6">
        <Error refetch={refetch} />
      </div>
    )
  }
  if(data.state === "UNCHECKED"){
    return <MonitorUnchecked className="mt-6" />
  }

  const dataChecks = data.checks.toReversed().map((el) => {
    return {...el,isUp: el.current_status === "UP" ? 1 : 0}
  })


  const upCount = dataChecks.filter((el) => el.isUp === 1).length;
  const uptimePct =
    dataChecks.length === 0
      ? null
      : Math.round((upCount / dataChecks.length) * 100);

  return (
      <div className="mt-6 px-4 py-4 pb-6 bg-sf-surface border border-sf-border rounded-sf">
        <div className="flex justify-between items-center">
          <h3 className="text-[14px] font-sans font-medium text-sf-text">
            Uptime · last 90 checks
          </h3>
          {uptimePct !== null && (
            <span className="text-[12px] font-sans text-sf-text-muted">
              <span className="font-semibold text-sf-text">{uptimePct}%</span>
              {" · "}
              {upCount}/{dataChecks.length} up
            </span>
          )}
        </div>

        <div>
          <div className="flex gap-1.5 mt-2">
            {dataChecks.map((el, index) => (
                <div
                    key={`${el.checked_at}-${id}`}
                    style={{
                      backgroundColor:
                          el.isUp === 0
                              ? "var(--color-sf-red)"
                              : "var(--color-sf-green)",
                      borderRadius: "2px",
                    }}
                    className="relative group w-2 h-8 origin-bottom transition-all duration-150 hover:scale-y-125 hover:brightness-110"
                >
                  <CheckTooltip
                      status={el.current_status}
                      responseTime={el.response_time}
                      checkedAt={el.checked_at}
                  />
                </div>
            ))}
          </div>
        </div>
      </div>
  );
};

const SSLStats = () => {
  return (
    <div className="relative border border-sf-border w-full bg-sf-surface rounded-sf flex flex-col overflow-hidden">
      <ComingSoonOverlay />
      <div className="px-4 py-3 flex items-center gap-2 border-b border-sf-border">
        <div className="w-6 h-6 flex items-center justify-center rounded-md bg-sf-bg border border-sf-border">
          <Shield className="h-3.5 w-3.5 text-sf-text-muted" />
        </div>
        <p className="font-sans font-semibold text-sf-text text-[14px]">
          SSL certificate
        </p>
      </div>
      <div className="flex flex-col divide-y divide-sf-border">
        <div className="flex justify-between items-center px-4 py-2.5">
          <p className="text-[12px] text-sf-text-muted font-sans">Status</p>
          <span
            className="flex items-center gap-1.5 text-[12px] font-semibold font-sans"
            style={{ color: "var(--color-sf-green)" }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full inline-block"
              style={{ backgroundColor: "var(--color-sf-green)" }}
            />
            Valid
          </span>
        </div>
        <div className="flex justify-between items-center px-4 py-2.5">
          <p className="text-[12px] text-sf-text-muted font-sans">Issuer</p>
          <p className="text-[12px] text-sf-text font-sans font-medium">
            Let's Encrypt
          </p>
        </div>
        <div className="flex justify-between items-center px-4 py-2.5">
          <p className="text-[12px] text-sf-text-muted font-sans">Expires</p>
          <p className="text-[12px] text-sf-text font-sans font-medium">
            Aug 14, 2026
          </p>
        </div>
        <div className="flex justify-between items-center px-4 py-2.5">
          <p className="text-[12px] text-sf-text-muted font-sans">Days left</p>
          <span
            className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md border"
            style={{
              color: "var(--color-sf-amber)",
              borderColor: "var(--color-sf-amber)",
            }}
          >
            61 days
          </span>
        </div>
      </div>
    </div>
  );
};

const DNSRecords = () => {
  return (
    <div className="relative border border-sf-border w-full bg-sf-surface rounded-sf flex flex-col overflow-hidden">
      <ComingSoonOverlay />
      <div className="px-4 py-3 flex items-center gap-2 border-b border-sf-border">
        <div className="w-6 h-6 flex items-center justify-center rounded-md bg-sf-bg border border-sf-border">
          <Wifi className="h-3.5 w-3.5 text-sf-text-muted" />
        </div>
        <p className="font-sans font-semibold text-sf-text text-[14px]">DNS</p>
      </div>
      <div className="flex flex-col divide-y divide-sf-border">
        <div className="flex justify-between items-center px-4 py-2.5">
          <p className="text-[12px] text-sf-text-muted font-sans">Status</p>
          <span
            className="flex items-center gap-1.5 text-[12px] font-semibold font-sans"
            style={{ color: "var(--color-sf-green)" }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full inline-block"
              style={{ backgroundColor: "var(--color-sf-green)" }}
            />
            Resolving
          </span>
        </div>
        <div className="flex justify-between items-center px-4 py-2.5">
          <p className="text-[12px] text-sf-text-muted font-sans">
            Records tracked
          </p>
          <p className="text-[12px] text-sf-text font-sans font-medium">
            6 records
          </p>
        </div>
        <div className="flex justify-between items-center px-4 py-2.5">
          <p className="text-[12px] text-sf-text-muted font-sans">
            Last change
          </p>
          <p className="text-[12px] text-sf-text font-sans font-medium">
            42 days ago
          </p>
        </div>
        <div className="flex justify-between items-center px-4 py-2.5">
          <p className="text-[12px] text-sf-text-muted font-sans">Monitoring</p>
          <p className="text-[11px] font-mono text-sf-text-sub font-medium tracking-wide">
            A · AAAA · CNAME · MX
          </p>
        </div>
      </div>
    </div>
  );
};

const RegionalLatency = ({
  region,
  latency,
  latencyMs,
}: RegionMonitorProps) => {
  const maxMs = 320;
  const barPct = Math.min((latencyMs / maxMs) * 100, 100);

  const color =
    latencyMs <= 150
      ? "var(--color-sf-green)"
      : latencyMs <= 220
        ? "var(--color-sf-amber)"
        : "var(--color-sf-red)";

  return (
    <div className="flex items-center gap-3 py-1 ">
      <span className="w-17 text-[12px] font-semibold text-sf-text-muted font-sans shrink-0">
        {region}
      </span>
      <div className="flex-1 h-1.5 bg-sf-border rounded-full overflow-hidden">
        <div
          style={{ width: `${barPct}%`, backgroundColor: color }}
          className="h-full rounded-full transition-all duration-300"
        />
      </div>
      <span
        style={{ color }}
        className="w-11 text-[12px] font-mono font-semibold text-right shrink-0"
      >
        {latency}
      </span>
    </div>
  );
};

export default CertificatesMonitor;
