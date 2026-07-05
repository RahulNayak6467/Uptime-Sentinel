"use client"
import IndividualMonitorsHeaders from "@/features/monitors-page/individual-monitor/individual-monitors-headers";
import IndividualMonitorInfoStats from "@/features/monitors-page/individual-monitor/monitor-info-stats";
import IndividualMonitorCharts from "@/features/monitors-page/individual-monitor/individual-monitor-chart";
import CertificatesMonitor from "@/features/monitors-page/individual-monitor/certificates-monitor";
import IncidentHistory from "@/features/monitors-page/individual-monitor/incident-history";
import MonitorSectionNav from "@/features/monitors-page/individual-monitor/monitor-section-nav";
import {useParams} from "next/navigation";
import {
    useIndividualMonitorOverview
} from "@/features/monitors-page/individual-monitor/hooks/useInvidualMonitorOverview";


const IndividualMonitorsPage = () => {
    const params = useParams<{id:string }>()
    const id = params.id;

    const {data:monitorOverviewData,isLoading:monitorOverviewLoading,isError:monitorOverviewError} = useIndividualMonitorOverview(id);
    return(<div className="min-h-full pb-12">
    <IndividualMonitorsHeaders id={id} monitorOverviewData={monitorOverviewData} monitorOverviewLoading={monitorOverviewLoading} monitorOverviewError={monitorOverviewError} />
    <div className="sf-page-content space-y-6">
        <MonitorSectionNav />
        <IndividualMonitorInfoStats monitorOverviewData={monitorOverviewData} monitorOverviewLoading={monitorOverviewLoading} monitorOverviewError={monitorOverviewError} />
        <IndividualMonitorCharts />
        <CertificatesMonitor />
        <IncidentHistory />
    </div>
    </div>)
}

export default IndividualMonitorsPage;
