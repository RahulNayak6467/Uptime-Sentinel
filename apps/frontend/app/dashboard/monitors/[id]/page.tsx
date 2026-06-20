import CertificatesMonitor from "@/features/monitors-page/individual-monitor/certificates-monitor";
import IncidentHistory from "@/features/monitors-page/individual-monitor/incident-history";
import IndividualMonitorCharts from "@/features/monitors-page/individual-monitor/individual-monitor-chart";
import IndividualMonitorsHeaders from "@/features/monitors-page/individual-monitor/individual-monitors-headers";
import IndividualMonitorInfoStats from "@/features/monitors-page/individual-monitor/monitor-info-stats";

const IndividualMonitorStats = () => {
  return (
    <section>
      <IndividualMonitorsHeaders />
      <div className="px-4">
        <IndividualMonitorInfoStats />
        <IndividualMonitorCharts />
        <CertificatesMonitor />
        <IncidentHistory />
      </div>
    </section>
  );
};

export default IndividualMonitorStats;
