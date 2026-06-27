"use client"
import { columns } from "./columns";
import { DataTable } from "./data-table";
import {useAllMonitorsData} from "@/features/Overview/hooks/useMonitorsData";
import {formatTimeUntil} from "@/utils/format-time-until";
import { MonitorTableSkeleton } from "@/components/loading/dashboard-skeletons";
import PageError from "@/components/page-error";



const MonitorStatsTable = () => {
    const {data,isLoading,isError,refetch} = useAllMonitorsData();

    if (isLoading) {
        return <MonitorTableSkeleton rows={5} />
    }

    if(isError || !data){
        return (
            <PageError
                title="Couldn't load monitors"
                description="We couldn't load your monitor data. Please try again."
                onRetry={() => refetch()}
            />
        )
    }

    const requiredData = data.map((el) => {
        return {
            url_name: el.urlName,
            url: el.url,
            uptime: el.uptimePercentage,
            responseTime:el.avgResponseTime !== null ? Number(el.avgResponseTime) : null,
            statusCode: 200,
            interval_seconds: el.intervalSeconds,
            next_check_at: formatTimeUntil(el.nextCheckAt),
            status: el.status,
            trend: el.response.map((res) => res.responseTime ?res.responseTime : null)
        }
    })


    return (
    <div className="px-6 py-4">
      <DataTable columns={columns} data={requiredData} />
    </div>
  );
};

export default MonitorStatsTable;
