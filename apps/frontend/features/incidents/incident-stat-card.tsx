import { IncidentsInfoProps } from "./types";

const IncidentStatCard = ({ title, information, color }: IncidentsInfoProps) => {
  return (
    <div className="p-4 flex flex-col w-full bg-sf-surface border border-sf-border rounded-lg gap-1">
      <p className="text-[14px] font-sans text-sf-text-muted">{title}</p>
      <p style={{ color: color }} className="text-lg font-sans ">
        {information}
      </p>
    </div>
  );
};

export default IncidentStatCard;
