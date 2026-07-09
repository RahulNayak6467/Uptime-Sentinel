import { Clock } from "lucide-react";

type MonitorUncheckedProps = {
  title?: string;
  description?: string;
  className?: string;
};

const MonitorUnchecked = ({
  title = "Not checked yet",
  description = "This monitor hasn't run its first check. Data will appear here once a check completes.",
  className = "",
}: MonitorUncheckedProps) => {
  return (
    <div
      role="status"
      className={`flex min-h-[160px] flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-sf-border bg-sf-surface px-4 py-8 text-center ${className}`}
    >
      <div className="flex size-10 items-center justify-center rounded-lg border border-sf-border bg-sf-bg">
        <Clock className="size-5 text-sf-text-muted" aria-hidden="true" />
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-[14px] font-semibold text-sf-text">{title}</p>
        <p className="max-w-sm text-[12px] text-sf-text-muted">{description}</p>
      </div>
    </div>
  );
};

export default MonitorUnchecked;
