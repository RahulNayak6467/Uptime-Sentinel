import { Info } from "lucide-react";

const MonitorPreview = () => {
  return (
    <div className=" border border-sf-border rounded-lg bg-sf-surface overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-sf-border">
        <span className="w-2 h-2 rounded-full bg-sf-border shrink-0" />
        <span className="text-[11px] font-semibold font-sans text-sf-text-muted tracking-widest uppercase">
          Preview
        </span>
      </div>

      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-sf-border shrink-0" />
            <span className="text-[14px] font-bold font-sans text-sf-text truncate">
              Unnamed mo...
            </span>
          </div>
          <span className="text-[11px] font-semibold font-sans text-sf-text border border-sf-border rounded-md px-2 py-0.5 shrink-0">
            HTTP / HTTPS
          </span>
        </div>

        <div className="px-3 py-2 border border-sf-border rounded-lg">
          <span className="font-mono text-[12.5px] text-sf-text-muted">
            https://example.com/health
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "Interval", value: "5m", available: true },
            { label: "Regions", value: "—", available: false },
            { label: "Method", value: "GET", available: true },
            { label: "Status", value: "—", available: false },
          ].map(({ label, value, available }) => (
            <div
              key={label}
              className={`flex flex-col gap-0.5 border rounded-lg px-3 py-2 ${
                available ? "border-sf-border" : "border-sf-border-faint bg-sf-bg"
              }`}
            >
              <span className={`text-[10px] font-semibold font-sans tracking-widest uppercase ${available ? "text-sf-text-muted" : "text-sf-text-muted opacity-50"}`}>
                {label}
              </span>
              <span className={`text-[13px] font-semibold font-sans ${available ? "text-sf-text" : "text-sf-text-muted"}`}>
                {value}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-start gap-2 bg-sf-bg border border-sf-border-faint rounded-lg px-3 py-2.5 opacity-50">
          <Info className="w-3.5 h-3.5 text-sf-text-muted shrink-0 mt-0.5" />
          <p className="text-[12px] font-sans text-sf-text-muted leading-snug">
            Checks run every <strong>5m</strong> from{" "}
            <strong>2</strong> regions once active.
          </p>
        </div>

        <div className="flex gap-2 flex-wrap opacity-50">
          {["US East", "EU West"].map((region) => (
            <span
              key={region}
              className="text-[12px] font-sans font-medium text-sf-text-muted border border-sf-border-faint rounded-lg px-2.5 py-1 bg-sf-bg"
            >
              {region}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MonitorPreview;
