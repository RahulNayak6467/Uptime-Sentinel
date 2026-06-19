import { columns } from "./columns";
import { servicesStatus } from "./data";
import { DataTable } from "./data-table";

const MonitorStatsTable = () => {
  return (
    <div className="px-6 py-4">
      <DataTable columns={columns} data={servicesStatus} />
    </div>
  );
};

export default MonitorStatsTable;
