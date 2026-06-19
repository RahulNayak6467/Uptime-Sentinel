import { monitoringRegions } from "../../data";

const MonitoringRegions = () => {
  return (
    <div className="w-full bg-white mt-6">
      <div className="w-full h-full border border-sf-border rounded-lg relative overflow-hidden">
        <div className="w-full border-b border-sf-border py-2 px-4 rounded-t-lg">
          <div className="flex items-center gap-2">
            <h1 className="text-[14px] font-sans font-semibold tracking-normal text-sf-text">
              Monitoring regions
            </h1>
            <span className="text-[10px] font-semibold font-sans px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-400 tracking-wide">
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
              className="px-3 py-1 rounded-lg border font-sans text-[12px] font-medium border-sf-border text-sf-text bg-white"
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
