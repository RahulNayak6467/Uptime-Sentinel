import OverviewHeaders from "@/features/Overview/components/overview-headers";
import SystemStatus from "@/features/Overview/components/system-status";
import OverviewStats from "@/features/Overview/components/overview-stats";
import IncidentAlert from "@/features/Overview/components/incident-alert";
import MonitorStatsTable from "@/components/monitor-stats-table/monitor-stats-table";
import ReliabilityOverview from "./reliability-overview";

const DashboardOverviewPage = () => {
  return (
    <div className="min-h-full">
      <OverviewHeaders />
      <div className="sf-page-content space-y-5 pb-12">
        <SystemStatus />
        <IncidentAlert />
        <OverviewStats />
        <ReliabilityOverview />
        <MonitorStatsTable />
      </div>
    </div>
  );
};

export default DashboardOverviewPage;
