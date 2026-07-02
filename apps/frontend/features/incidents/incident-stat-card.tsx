import { IncidentsInfoProps } from "./types";

const IncidentStatCard = ({ title, information, color }: IncidentsInfoProps) => {
  return (
    <div className="flex min-h-24 w-full flex-col justify-center gap-1 rounded-lg border border-sf-border bg-sf-surface p-5 transition-colors hover:border-sf-text-muted">
      <p className="text-[14px] font-sans text-sf-text-muted">{title}</p>
      <p style={{ color: color }} className="text-2xl font-bold font-sans leading-tight">
        {information}
      </p>
    </div>
  );
};

export default IncidentStatCard;
