"use client";

import { useState } from "react";
import { RowSelectionState } from "@tanstack/react-table";
import MonitorsHeader from "./monitors-header";
import MonitorsFilterTabs from "./monitors-filter-tabs";
import { MonitorsDataTable } from "./data-table";
import BulkActionBar from "./bulk-action-bar";
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

type Tab = "all" | MonitorState;

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
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const isFetchingMonitors =
    useIsFetching({ queryKey: ["all monitors data by status"] }) > 0;

  const selectedCount = Object.keys(rowSelection).length;

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

  console.log(currentPage);

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

  const requiredData: MonitorPageData[] = monitorTableData.data.map((el) => {
    return {
      name: el.urlName,
      url: el.url,
      uptime: el.uptimePercentage,
      responseTime:
        el.avgResponseTime !== null ? Number(el.avgResponseTime) : null,
      type: "http",
      interval: `${el.intervalSeconds}s`,
      nextCheck: formatTimeUntil(el.nextCheckAt),
      state: normalizeMonitorState(el.status),
      trend: el.response
        .slice(0, 26)
        .map((res) => res.responseTime)
        .filter((rt): rt is number => rt !== null),
    };
  });

  return (
    <section>
      <MonitorsHeader />
      <div className="sf-page-content">
      <MonitorsFilterTabs active={activeTab} onChange={onChange} />
      <div className="relative mt-4 flex flex-col gap-3">
        <FetchingIndicator
          active={isFetchingMonitors && !isLoading}
          label="Updating monitors"
        />
        {selectedCount > 0 && (
          <BulkActionBar
            count={selectedCount}
            onClear={() => setRowSelection({})}
          />
        )}
        <MonitorsDataTable
          onChangePage={onChangePage}
          currentPage={currentPage}
          totalPage={totalPage}
          columns={columns}
          data={requiredData}
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
          isFiltered={activeTab !== "all"}
          onClearFilter={clearFilter}
        />
      </div>
      </div>
    </section>
  );
};

export default MonitorsPage;
