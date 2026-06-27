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
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const selectedCount = Object.keys(rowSelection).length;

  const onChange = (tab: Tab) => {
    setActiveTab(() => tab);
  };

  const { data, isLoading, isError, refetch } = useFilter(activeTab);

  if (isLoading) {
    return <MonitorsLoading />;
  }

  if (isError || !data) {
    return (
      <PageError
        title="Couldn't load monitors"
        description="We couldn't load your monitor data. Please try again."
        onRetry={() => refetch()}
      />
    );
  }

  const requiredData: MonitorPageData[] = data.map((el) => {
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
      <MonitorsFilterTabs active={activeTab} onChange={onChange} />
      <div className="px-6 py-4 flex flex-col gap-3">
        {selectedCount > 0 && (
          <BulkActionBar
            count={selectedCount}
            onClear={() => setRowSelection({})}
          />
        )}
        <MonitorsDataTable
          columns={columns}
          data={requiredData}
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
        />
      </div>
    </section>
  );
};

export default MonitorsPage;
