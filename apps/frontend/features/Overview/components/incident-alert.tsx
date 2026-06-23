import { TriangleAlert, Clock } from "lucide-react";

const IncidentAlert = () => {
  return (
    <div className="mx-6 mt-4 rounded-sf border border-sf-red-border bg-sf-red-bg px-4 py-3">
      <div className="flex items-start justify-between gap-6">

        <div className="flex flex-col gap-1.5 min-w-0">
=
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[14px] font-bold text-sf-text">
              Checkout Service
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-sf-text text-sf-red-bg tracking-wide">
              HTTP 503
            </span>
            <span className="px-2 py-0.5 rounded border border-sf-red text-[11px] font-semibold text-sf-red tracking-wide">
              MAJOR OUTAGE
            </span>
          </div>


          <div className="flex items-center gap-2">
            <span className="mt-0.5 flex items-center justify-center w-6 h-6 rounded bg-sf-red/10 shrink-0">
              <TriangleAlert className="w-3.5 h-3.5 text-sf-red" />
            </span>
            <p className="text-[13px] text-sf-text-sub leading-relaxed">
              Endpoint returning{" "}
              <code className="font-mono text-sf-red bg-sf-red/10 px-1 py-0.5 rounded text-[12px]">
                503 Service Unavailable
              </code>
              . Upstream payment provider timing out — engineering has been
              paged.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-center">
          <span className="flex items-center gap-1.5 text-[13px] text-sf-text-sub whitespace-nowrap">
            <Clock className="w-3.5 h-3.5" />
            12m 04s
          </span>
          <button className="flex items-center gap-1 px-3 py-1.5 rounded-sf border border-sf-red text-[13px] font-semibold text-sf-red hover:bg-sf-red hover:text-sf-red-bg transition-colors cursor-pointer whitespace-nowrap">
            View Incident ↗
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncidentAlert;
