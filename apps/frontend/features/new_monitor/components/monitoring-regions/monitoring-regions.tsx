import { monitoringRegions } from "../../data";

const MonitoringRegions = () => {
  return (
    <div className="mt-4 w-full bg-sf-surface">
      <div className="relative h-full w-full overflow-hidden rounded-lg border border-sf-border">
        <div className="w-full rounded-t-lg border-b border-sf-border px-4 py-2">
          <div className="flex items-center gap-2">
            <h1 className="text-[14px] font-sans font-semibold tracking-normal text-sf-text">
              Monitoring regions
            </h1>
            <span className="text-[10px] font-semibold font-sans px-1.5 py-0.5 rounded-full bg-sf-bg text-sf-text-muted tracking-wide">
              Soon
            </span>
          </div>
          <p className="text-[12px] font-sans text-sf-text-sub">
            Multi-region monitoring coming soon
          </p>
        </div>
        <div className="px-4 py-3 flex gap-2 flex-wrap opacity-40 pointer-events-none">
          {monitoringRegions.map((region) => (
            <button
              key={region}
              type="button"
              className="rounded-sf-sm border border-sf-border bg-sf-surface px-3 py-1 font-sans text-[12px] font-medium text-sf-text"
            >
              {region}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MonitoringRegions;
