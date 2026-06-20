import { IncidentsInfoProps } from "./types";

const IncidentStatCard = ({ title, information, color }: IncidentsInfoProps) => {
  return (
    <div className="p-4 flex flex-col w-full bg-sf-surface border border-sf-border rounded-lg gap-1 hover:border-sf-text-muted transition-colors">
      <p className="text-[14px] font-sans text-sf-text-muted">{title}</p>
      <p style={{ color: color }} className="text-2xl font-bold font-sans leading-tight">
        {information}
      </p>
    </div>
  );
};

export default IncidentStatCard;
