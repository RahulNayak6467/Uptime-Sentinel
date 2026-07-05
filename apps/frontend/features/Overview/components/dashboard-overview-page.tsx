import OverviewHeaders from "@/features/Overview/components/overview-headers";
import OverviewStats from "@/features/Overview/components/overview-stats";
import IncidentAlert from "@/features/Overview/components/incident-alert";
import MonitorStatsTable from "@/components/monitor-stats-table/monitor-stats-table";
import ReliabilityOverview from "./reliability-overview";

const DashboardOverviewPage = () => {
  return (
    <div>
      <OverviewHeaders />
      <div className="sf-page-content space-y-5">
        <OverviewStats />
        <IncidentAlert />
        <ReliabilityOverview />
        <MonitorStatsTable />
      </div>
    </div>
  );
}

export default DashboardOverviewPage;
