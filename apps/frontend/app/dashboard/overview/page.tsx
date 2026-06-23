import MonitorStatsTable from "@/components/monitor-stats-table/monitor-stats-table";
import OverviewHeaders from "@/features/Overview/components/overview-headers";
import OverviewStats from "@/features/Overview/components/overview-stats";
import IncidentAlert from "@/features/Overview/components/incident-alert";

const Overview = () => {
  return (
    <section>
      <OverviewHeaders />
      <div>
        <OverviewStats />
      </div>
      <IncidentAlert />
      <div>
        <MonitorStatsTable />
      </div>
    </section>
  );
};

export default Overview;
