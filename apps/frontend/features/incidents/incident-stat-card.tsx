import { IncidentsInfoProps } from "./types";

const IncidentStatCard = ({ title, information, color }: IncidentsInfoProps) => {
  return (
    <div className="flex min-h-24 w-full flex-col justify-center gap-1 rounded-lg border border-sf-border bg-sf-surface p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition-[border-color,box-shadow] hover:border-sf-text-muted/60 hover:shadow-sf-card">
      <p className="text-[14px] font-sans text-sf-text-muted">{title}</p>
      <p style={{ color: color }} className="text-2xl font-semibold leading-tight tracking-sf-tight">
        {information}
      </p>
    </div>
  );
};

export default IncidentStatCard;
