import IncidentStats from "@/features/incidents/incident-stats";
import IncidentHeader from "@/features/incidents/incident-header";
import IncidentList from "@/features/incidents/incident-list";

const Incidents = () => {
  return (
    <section className="pb-8">
      <IncidentHeader />
      <div>
        <IncidentStats />
        <IncidentList />
      </div>
    </section>
  );
};

export default Incidents;
