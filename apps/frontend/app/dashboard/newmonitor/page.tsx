import AlertConditions from "@/features/new_monitor/components/alert-conditions/alert-conditions";
import CheckInterval from "@/features/new_monitor/components/check-interval/check-interval";
import MonitorInfo from "@/features/new_monitor/components/monitor-info/monitor-info";
import MonitorPreview from "@/features/new_monitor/components/monitor-preview/monitor-preview";
import MonitorTypeInfo from "@/features/new_monitor/components/monitor-types/monitor-type-info";
import NewMonitorHeader from "@/features/new_monitor/components/monitor-types/new-monitor-header";
import MonitoringRegions from "@/features/new_monitor/components/monitoring-regions/monitoring-regions";
import Notifications from "@/features/new_monitor/components/notifications/notifications";
import RequestType from "@/features/new_monitor/components/request-settings/request-type";

const NewMonitor = () => {
  return (
    <section className="pb-8">
      <NewMonitorHeader />
      <div className="w-[98%] flex gap-2  ml-4 mt-4 ">
        <div className="w-[80%]">
          <MonitorTypeInfo />
          <MonitorInfo />
          <RequestType />
          <CheckInterval />
          <MonitoringRegions />
          <AlertConditions />
          <Notifications />
        </div>
        <div>
          <MonitorPreview />
        </div>
      </div>
    </section>
  );
};

export default NewMonitor;
