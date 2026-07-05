import { IncidentsInfoProps } from "./types";

const IncidentStatCard = ({ title, information, color }: IncidentsInfoProps) => {
  return (
    <div className="flex min-h-[106px] w-full flex-col justify-center gap-1.5 rounded-lg border border-sf-border bg-sf-surface p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition-colors hover:border-sf-text-muted/50">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-sf-text-muted">
        {title}
      </p>
      <p style={{ color }} className="text-[26px] font-semibold leading-tight tracking-sf-tight tabular-nums">
        {information}
      </p>
    </div>
  );
};

export default IncidentStatCard;
