"use client";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useAllMonitorsData } from "@/features/Overview/hooks/useMonitorsData";
import { formatTimeUntil } from "@/utils/format-time-until";
import { MonitorTableSkeleton } from "@/components/loading/dashboard-skeletons";
import PageError from "@/components/page-error";
import { useState } from "react";
import { LIMIT } from "@/constants/constant";
import { useSSEMonitors } from "@/features/Overview/hooks/useSSEMonitors";

const MonitorStatsTable = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const {
    data: monitorTableData,
    isLoading,
    isError,
    refetch,
  } = useAllMonitorsData(currentPage, LIMIT);

  useSSEMonitors(currentPage);

  const changeCurrentPage = (page: number) => {
    setCurrentPage(() => page);
  };

  if (isLoading) {
    return <MonitorTableSkeleton rows={5} />;
  }

  if (isError || !monitorTableData) {
    return (
      <PageError
        title="Couldn't load monitors"
        description="We couldn't load your monitor data. Please try again."
        onRetry={() => refetch()}
      />
    );
  }

  const { totalPage } = monitorTableData.pagination;

  const requiredData = monitorTableData.data.map((el) => {
    return {
      id: el.id,
      url_name: el.urlName,
      url: el.url,
      uptime: el.uptimePercentage,
      responseTime:
        el.avgResponseTime !== null ? Number(el.avgResponseTime) : null,
      statusCode: el?.statusCode ?? 200,
      interval_seconds: el.intervalSeconds,
      next_check_at: formatTimeUntil(el.nextCheckAt),
      status: el.status,
      trend: el.response
        .slice(0, 26)
        .map((res) => res.responseTime)
        .filter((rt): rt is number => rt !== null),
    };
  });

  return (
    <section>
      <div className="mb-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-sf-blue">
          Endpoint inventory
        </p>
        <h2 className="mt-1 text-base font-semibold tracking-sf-tight text-sf-text">
          Monitor health
        </h2>
      </div>
      <DataTable
        columns={columns}
        currentPage={currentPage}
        changeCurrentPage={changeCurrentPage}
        totalPage={totalPage}
        data={requiredData}
      />
    </section>
  );
};

export default MonitorStatsTable;
