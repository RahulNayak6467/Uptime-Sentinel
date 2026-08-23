"use client";

import { useState } from "react";
import MonitorsHeader from "./monitors-header";
import MonitorsFilterTabs, { type MonitorTab } from "./monitors-filter-tabs";
import { MonitorsDataTable } from "./data-table";
import { columns } from "./columns";
import { MonitorPageData, MonitorState } from "./types";
import { formatTimeUntil } from "@/utils/format-time-until";
import { MonitorsLoading } from "@/components/loading/dashboard-skeletons";
import PageError from "@/components/page-error";
import { useFilter } from "./hooks/useFilter";
import { LIMIT } from "@/constants/constant";
import { useSSEMonitorsData } from "./hooks/useSSEMonitorsData";
import { useIsFetching } from "@tanstack/react-query";
import { FetchingIndicator } from "@/components/ui/fetching-indicator";
import { formatCheckInterval } from "@/utils/format-check-interval";
import { useDashboardOverview } from "@/features/Overview/hooks/useDashboardOverview";
import MonitorSummary from "./monitor-summary";

type Tab = MonitorTab;

const normalizeMonitorState = (
  status: "UP" | "DOWN" | "UNKNOWN",
): MonitorState => {
  if (status === "UP") return "up";
  if (status === "DOWN") return "down";
  return "unknown";
};

const MonitorsPage = () => {
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const isFetchingMonitors =
    useIsFetching({ queryKey: ["all monitors data by status"] }) > 0;
  const {
    data: overview,
    isLoading: isOverviewLoading,
    isFetching: isOverviewFetching,
    refetch: refetchOverview,
  } = useDashboardOverview();

  const onChange = (tab: Tab) => {
    setActiveTab(() => tab);
    setCurrentPage(1);
  };

  const clearFilter = () => {
    setActiveTab("all");
    setCurrentPage(1);
  };

  const onChangePage = (page: number) => {
    setCurrentPage(() => page);
  };

  const {
    data: monitorTableData,
    isLoading,
    isError,
    refetch,
  } = useFilter(activeTab, currentPage, LIMIT);

  useSSEMonitorsData(currentPage, activeTab);

  if (isLoading) {
    return <MonitorsLoading />;
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
  const unknownCount = overview
    ? Math.max(
        overview.total_monitors -
          overview.up_count -
          overview.down_count -
          overview.paused_monitors,
        0,
      )
    : undefined;
  const tabCounts = overview
    ? {
        all: overview.total_monitors,
        up: overview.up_count,
        down: overview.down_count,
        unknown: unknownCount,
        paused: overview.paused_monitors,
      }
    : undefined;
  const filteredTotalPage =
    activeTab === "all" || !tabCounts
      ? totalPage
      : Math.max(1, Math.ceil((tabCounts[activeTab] ?? 0) / LIMIT));

  const requiredData: MonitorPageData[] = monitorTableData.data.map((el) => {
    const isPaused = activeTab === "paused";

    return {
      id: el.id,
      name: el.monitorName,
      url: el.url,
      uptime: el.uptimePercentage,
      responseTime:
        el.avgResponseTime !== null ? Number(el.avgResponseTime) : null,
      statusCode: el.statusCode,
      type: el.monitorType,
      interval: formatCheckInterval(el.intervalSeconds),
      nextCheck: isPaused ? "Checks paused" : formatTimeUntil(el.nextCheckAt),
      state: isPaused ? "paused" : normalizeMonitorState(el.status),
      trend: el.response
        .slice(-26)
        .map((res) => res.responseTime)
        .filter((rt): rt is number => rt !== null),
    };
  });

  return (
    <section className="min-h-full">
      <MonitorsHeader
        onRefresh={() => void Promise.all([refetch(), refetchOverview()])}
        isRefreshing={isFetchingMonitors || isOverviewFetching}
      />
      <div className="sf-page-content pb-12">
        <MonitorSummary data={overview} isLoading={isOverviewLoading} />

        <div className="mt-6">
          <MonitorsFilterTabs
            active={activeTab}
            counts={tabCounts}
            onChange={onChange}
          />
        </div>

        <div className="relative mt-4 flex flex-col gap-3">
          <FetchingIndicator
            active={isFetchingMonitors && !isLoading}
            label="Updating monitors"
          />
          <MonitorsDataTable
            onChangePage={onChangePage}
            currentPage={currentPage}
            totalPage={filteredTotalPage}
            columns={columns}
            data={requiredData}
            activeFilter={activeTab}
            isFiltered={activeTab !== "all"}
            onClearFilter={clearFilter}
          />
        </div>
      </div>
    </section>
  );
};

export default MonitorsPage;
