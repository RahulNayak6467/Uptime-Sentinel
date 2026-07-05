import { monitoringRegions } from "../../data";
import SectionHeader from "../section-header";

const MonitoringRegions = () => {
  return (
    <div className="mt-4 w-full">
      <div className="relative h-full w-full overflow-hidden rounded-lg border border-sf-border bg-sf-surface shadow-sm">
        <SectionHeader title="Monitoring regions" description="Run checks from multiple geographic locations" badge="Planned" />
        <div className="pointer-events-none flex flex-wrap gap-2 p-5 opacity-40">
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
