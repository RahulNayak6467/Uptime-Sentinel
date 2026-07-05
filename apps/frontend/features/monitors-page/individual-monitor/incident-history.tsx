import { CheckCircle2 } from "lucide-react";

const IncidentHistory = () => {
  return (
    <section id="incidents" className="sf-panel scroll-mt-16 p-5 pb-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-[14px] font-semibold text-sf-text">Incident history</h3>
          <p className="mt-1 text-xs text-sf-text-muted">Outages and recoveries associated with this endpoint</p>
        </div>
      </div>
      <div className="mt-4 flex min-h-32 w-full items-center justify-center rounded-md border border-dashed border-sf-border bg-sf-bg/40 px-4">
        <div className="text-center">
          <CheckCircle2 className="mx-auto size-5 text-sf-green" />
          <p className="mt-2 text-xs font-semibold text-sf-text">No incidents recorded</p>
          <p className="mt-1 text-[11px] text-sf-text-muted">This monitor has no outage history.</p>
        </div>
      </div>
    </section>
  );
};

export default IncidentHistory;
