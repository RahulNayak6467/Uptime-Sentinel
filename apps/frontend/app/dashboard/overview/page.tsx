import MonitorStatsTable from "@/components/monitor-stats-table/monitor-stats-table";
import OverviewHeaders from "@/features/Overview/overview-headers";
import OverviewStats from "@/features/Overview/overview-stats";
import IncidentAlert from "@/features/Overview/incident-alert";

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
