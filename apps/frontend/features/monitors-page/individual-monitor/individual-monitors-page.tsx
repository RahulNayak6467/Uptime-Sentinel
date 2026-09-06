"use client";
import IndividualMonitorsHeaders from "@/features/monitors-page/individual-monitor/individual-monitors-headers";
import IndividualMonitorInfoStats from "@/features/monitors-page/individual-monitor/monitor-info-stats";
import IndividualMonitorCharts from "@/features/monitors-page/individual-monitor/individual-monitor-chart";
import { LastChecksBar } from "@/features/monitors-page/individual-monitor/last-checks-bar";
import MonitorChecksPanels from "@/features/monitors-page/individual-monitor/monitor-checks-panels";
import IncidentHistory from "@/features/monitors-page/individual-monitor/incident-history";
import MonitorSectionNav from "@/features/monitors-page/individual-monitor/monitor-section-nav";
import CertificatesMonitor from "@/features/monitors-page/individual-monitor/design/certificates-monitor";
// VPS monitoring is out of current scope — parked, not deleted.
// import VpsMonitor from "@/features/monitors-page/individual-monitor/design/vps-monitor";
import { useParams } from "next/navigation";
import { useIndividualMonitorOverview } from "@/features/monitors-page/individual-monitor/hooks/useInvidualMonitorOverview";

const IndividualMonitorsPage = () => {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const {
    data: monitorOverviewData,
    isLoading: monitorOverviewLoading,
    isError: monitorOverviewError,
  } = useIndividualMonitorOverview(id);
  const isTlsMonitor = monitorOverviewData?.monitorType === "tls";
  const supportsTls =
    monitorOverviewData?.monitorType === "http" ||
    monitorOverviewData?.monitorType === "https" ||
    isTlsMonitor;

  const tlsMonitorId = isTlsMonitor
    ? id
    : monitorOverviewData?.linkedTlsMonitorId ?? null;

  if (isTlsMonitor) {
    return (
      <div className="min-h-full pb-12">
        <IndividualMonitorsHeaders
          id={id}
          monitorOverviewData={monitorOverviewData}
          monitorOverviewLoading={monitorOverviewLoading}
          monitorOverviewError={monitorOverviewError}
        />
        <div className="sf-page-content space-y-6">
          <CertificatesMonitor tlsMonitorId={id} />
          <IncidentHistory id={id} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full pb-12">
      <IndividualMonitorsHeaders
        id={id}
        monitorOverviewData={monitorOverviewData}
        monitorOverviewLoading={monitorOverviewLoading}
        monitorOverviewError={monitorOverviewError}
      />
      <div className="sf-page-content space-y-6">
        <MonitorSectionNav showTls={supportsTls} />
        <IndividualMonitorInfoStats
          monitorOverviewData={monitorOverviewData}
          monitorOverviewLoading={monitorOverviewLoading}
          monitorOverviewError={monitorOverviewError}
        />
        <IndividualMonitorCharts />
        <div id="recent-checks" className="scroll-mt-16">
          <LastChecksBar />
        </div>
        <IncidentHistory id={id} />
        {supportsTls ? (
          <div id="infrastructure" className="scroll-mt-16">
            <MonitorChecksPanels tlsMonitorId={tlsMonitorId} />
          </div>
        ) : null}
        {/* VPS monitoring is out of current scope — parked, not deleted.
        <div id="vps" className="scroll-mt-16">
          <VpsMonitor />
        </div> */}
      </div>
    </div>
  );
};

export default IndividualMonitorsPage;
