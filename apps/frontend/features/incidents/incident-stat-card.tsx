import { IncidentsInfoProps } from "./types";

const IncidentStatCard = ({
  title,
  information,
  color,
  icon: Icon,
  context,
}: IncidentsInfoProps) => {
  return (
    <div className="flex min-h-[112px] w-full flex-col justify-between rounded-[8px] border border-sf-border bg-sf-surface p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-medium text-sf-text-muted">{title}</p>
        <span className="flex size-7 items-center justify-center rounded-[5px] border border-sf-border-faint bg-sf-bg text-sf-text-muted">
          <Icon className="size-3.5" strokeWidth={1.8} />
        </span>
      </div>
      <div className="mt-2">
        <p style={{ color }} className="text-[24px] font-semibold leading-none tracking-sf-tight tabular-nums">
          {information}
        </p>
        <p className="mt-1.5 text-[10px] text-sf-text-muted">{context}</p>
      </div>
    </div>
  );
};

export default IncidentStatCard;
