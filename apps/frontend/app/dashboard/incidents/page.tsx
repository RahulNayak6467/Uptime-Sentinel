import IncidentStats from "@/features/incidents/incident-stats";
import IncidentHeader from "@/features/incidents/incident-header";
import IncidentList from "@/features/incidents/incident-list";

const Incidents = () => {
  return (
    <section className="min-h-full pb-12">
      <IncidentHeader />
      <div className="sf-page-content space-y-7">
        <IncidentStats />
        <IncidentList />
      </div>
    </section>
  );
};

export default Incidents;
