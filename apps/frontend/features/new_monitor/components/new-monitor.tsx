"use client";

import { useState } from "react";
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
import { zodResolver } from "@/lib/zod-resolver";
import { monitorInfoProps, monitorInfoSchema } from "../schemas/monitor-info";
import { useUrlRegister } from "../hooks/useUrlRegister";
import { useRouter } from "next/router";
import { ApiError } from "next/dist/server/api-utils";
import { toast } from "sonner";

const NewMonitorProperties = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<monitorInfoProps>({
    resolver: zodResolver(monitorInfoSchema),
  });

  const [monitorType, setMonitorType] = useState("HTTP/HTTPS");
  const [interval, setInterval] = useState("5m");
  const [method, setMethod] = useState("get");

  const monitorName = watch("monitorName");
  const url = watch("url");
  const timeout = watch("timeout");
  const statusCode = watch("statusCode");
  const responseTimeAlert = watch("responseTimeAlert");

  const { mutate, isPending } = useUrlRegister();

  const onSubmit = (data: monitorInfoProps) => {
    const urlDetails = {
      url: data.url,
      urlName: data.monitorName,
      intervalSeconds: data.responseTimeAlert,
    };

    mutate(urlDetails, {
      onSuccess: () => {
        toast.success("Url is registered");
      },
      onError: (err) => {
        console.log(err);
        if (err instanceof ApiError) {
          toast.error(err.message);
        } else {
          toast.error(err.message);
        }
      },
    });
  };

  return (
    <div>
      <NewMonitorHeader
        onSubmit={onSubmit}
        handleSubmit={handleSubmit}
        isPending={isPending}
      />
      <div className="w-[98%] flex gap-2  ml-4 mt-4 ">
        <div className="w-[80%]">
          <MonitorTypeInfo selected={monitorType} onSelect={setMonitorType} />
          <MonitorInfo
            register={register}
            errors={{
              errorsMonitorName: errors.monitorName?.message,
              errorsMonitorUrl: errors.url?.message,
            }}
          />
          <RequestType
            register={register}
            selectedMethod={method}
            onMethodChange={setMethod}
            errors={{
              errorsTimeout: errors.timeout?.message,
              errorsStatusCode: errors.statusCode?.message,
            }}
          />
          <CheckInterval selected={interval} onSelect={setInterval} />
          <MonitoringRegions />
          <AlertConditions
            register={register}
            errors={errors.responseTimeAlert?.message}
          />
          <Notifications />
        </div>
        <div>
          <MonitorPreview
            monitorName={monitorName}
            url={url}
            type={monitorType}
            interval={interval}
            method={method}
            timeout={timeout}
            statusCode={statusCode}
            responseTimeAlert={responseTimeAlert}
          />
        </div>
      </div>
    </div>
  );
};

export default NewMonitorProperties;
