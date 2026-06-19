"use client";

import AlertConditions from "./alert-conditions/alert-conditions";
import CheckInterval from "./check-interval/check-interval";
import MonitorInfo from "./monitor-info/monitor-info";
import MonitorPreview from "./monitor-preview/monitor-preview";
import MonitorTypeInfo from "./monitor-types/monitor-type-info";
import NewMonitorHeader from "./monitor-types/new-monitor-header";
import MonitoringRegions from "./monitoring-regions/monitoring-regions";
import Notifications from "./notifications/notifications";
import RequestType from "./request-settings/request-type";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { monitorInfoProps, monitorInfoSchema } from "../schemas/monitor-info";

const NewMonitorProperties = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<monitorInfoProps>({
    resolver: zodResolver(monitorInfoSchema),
  });

  const onSubmit = (data: monitorInfoProps) => {
    console.log(data);
  };

  return (
    <div>
      <NewMonitorHeader />
      <div className="w-[98%] flex gap-2  ml-4 mt-4 ">
        <div className="w-[80%]">
          <MonitorTypeInfo />
          <MonitorInfo
            register={register}
            errors={{
              errorsMonitorName: errors.monitorName?.message,
              errorsMonitorUrl: errors.url?.message,
            }}
          />
          <RequestType
            register={register}
            errors={{
              errorsTimeout: errors.timeout?.message,
              errorsStatusCode: errors.statusCode?.message,
            }}
          />
          <CheckInterval />
          <MonitoringRegions />
          <AlertConditions
            register={register}
            errors={errors.responseTimeAlert?.message}
          />
          <Notifications />
        </div>
        <div>
          <MonitorPreview />
        </div>
      </div>
    </div>
  );
};

export default NewMonitorProperties;
