"use client";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useAllMonitorsData } from "@/features/Overview/hooks/useMonitorsData";
import { formatTimeUntil } from "@/utils/format-time-until";
import { MonitorTableSkeleton } from "@/components/loading/dashboard-skeletons";
import PageError from "@/components/page-error";
import { LIMIT } from "@/constants/constant";
import { useState } from "react";

const MonitorStatsTable = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const {
    data: monitorTableData,
    isLoading,
    isError,
    refetch,
  } = useAllMonitorsData(currentPage, LIMIT);

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
      url_name: el.urlName,
      url: el.url,
      uptime: el.uptimePercentage,
      responseTime:
        el.avgResponseTime !== null ? Number(el.avgResponseTime) : null,
      statusCode: 200,
      interval_seconds: el.intervalSeconds,
      next_check_at: formatTimeUntil(el.nextCheckAt),
      status: el.status,
      trend: el.response
        .map((res) => res.responseTime)
        .filter((rt): rt is number => rt !== null),
    };
  });

  return (
    <div className="px-6 py-4">
      <DataTable
        columns={columns}
        data={requiredData}
        currentPage={currentPage}
        changeCurrentPage={changeCurrentPage}
        totalPage={totalPage}
      />
    </div>
  );
};

export default MonitorStatsTable;
