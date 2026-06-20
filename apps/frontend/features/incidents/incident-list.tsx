import { incidentListData } from "./data";
import { IncidentListItemProps } from "./types";

const statusConfig = {
  active: {
    dot: "bg-sf-red",
    badge: "bg-sf-red-bg text-sf-red border border-sf-red/30",
    label: "Active",
  },
  resolved: {
    dot: "bg-sf-green",
    badge: "bg-sf-green-bg text-sf-green border border-sf-green/30",
    label: "Resolved",
  },
};

const IncidentRow = ({
  title,
  status,
  service,
  date,
  time,
  duration,
  description,
}: Omit<IncidentListItemProps, "id">) => {
  const config = statusConfig[status];

  return (
    <div className="flex gap-3 px-4 py-3 border-b border-sf-border last:border-b-0 hover:bg-sf-border-faint/60 transition-colors cursor-pointer">
      <span className={`w-2 h-2 rounded-full shrink-0 mt-[5px] ${config.dot}`} />
      <div className="flex flex-col gap-0.5 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[14px] font-bold font-sans text-sf-text">
            {title}
          </span>
          <span className={`text-[10px] font-semibold font-sans px-1.5 py-px rounded-full ${config.badge}`}>
            {config.label}
          </span>
        </div>
        <p className="text-[12px] font-sans text-sf-text-muted">
          {service} · {date} · {time} · {duration}
        </p>
        <p className="text-[12px] font-sans text-sf-text-sub">
          {description}
        </p>
      </div>
    </div>
  );
};

const IncidentList = () => {
  return (
    <div className="w-full mt-4 px-4">
      <div className="border border-sf-border rounded-lg bg-sf-surface overflow-hidden">
        {incidentListData.map((incident) => (
          <IncidentRow
            key={incident.id}
            title={incident.title}
            status={incident.status}
            service={incident.service}
            date={incident.date}
            time={incident.time}
            duration={incident.duration}
            description={incident.description}
          />
        ))}
      </div>
    </div>
  );
};

export default IncidentList;
