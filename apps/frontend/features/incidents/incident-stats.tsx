import { IncidentsData } from "./data";
import IncidentStatCard from "./incident-stat-card";

const IncidentStats = () => {
  return (
    <div className="w-full mt-4">
      <div className="px-4 flex gap-4">
        {IncidentsData.map((incidents) => (
          <IncidentStatCard
            key={incidents.id}
            title={incidents.title}
            information={incidents.information}
            color={incidents.color}
          />
        ))}
      </div>
    </div>
  );
};

export default IncidentStats;
