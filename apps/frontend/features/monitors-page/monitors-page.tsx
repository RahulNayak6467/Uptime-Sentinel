"use client";

import { useState } from "react";
import { RowSelectionState } from "@tanstack/react-table";
import MonitorsHeader from "./monitors-header";
import MonitorsFilterTabs from "./monitors-filter-tabs";
import { MonitorsDataTable } from "./data-table";
import BulkActionBar from "./bulk-action-bar";
import { columns } from "./columns";
import { monitorsData } from "./data";
import { MonitorState } from "./types";

type Tab = "all" | MonitorState;

const MonitorsPage = () => {
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const selectedCount = Object.keys(rowSelection).length;

  return (
    <section>
      <MonitorsHeader />
      <MonitorsFilterTabs
        data={monitorsData}
        active={activeTab}
        onChange={(tab) => {
          setActiveTab(tab);
          setRowSelection({});
        }}
      />
      <div className="px-6 py-4 flex flex-col gap-3">
        {selectedCount > 0 && (
          <BulkActionBar
            count={selectedCount}
            onClear={() => setRowSelection({})}
          />
        )}
        <MonitorsDataTable
          columns={columns}
          data={monitorsData}
          stateFilter={activeTab}
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
        />
      </div>
    </section>
  );
};

export default MonitorsPage;
