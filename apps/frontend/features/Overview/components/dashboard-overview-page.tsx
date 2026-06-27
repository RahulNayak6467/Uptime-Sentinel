import OverviewHeaders from "@/features/Overview/components/overview-headers";
import OverviewStats from "@/features/Overview/components/overview-stats";
import IncidentAlert from "@/features/Overview/components/incident-alert";
import MonitorStatsTable from "@/components/monitor-stats-table/monitor-stats-table";

const DashboardOverviewPage = () => {
    return (
        <div>
        <OverviewHeaders />
        <div>
        <OverviewStats />
        </div>
    <IncidentAlert />
    <div>
        <MonitorStatsTable />
    </div>
        </div>
    )
}

export default DashboardOverviewPage;