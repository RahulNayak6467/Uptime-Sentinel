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
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { monitorInfoProps, monitorInfoSchema } from "../schemas/monitor-info";
import { useUrlRegister } from "../hooks/useUrlRegister";
import { intervalToSeconds } from "../utils/interval";
import { ApiError } from "next/dist/server/api-utils";
import { toast } from "sonner";
import { CheckCircle2, Circle } from "lucide-react";

const SetupChecklist = ({ hasName, hasUrl }: { hasName: boolean; hasUrl: boolean }) => {
  const items = [
    { label: "Monitor type selected", complete: true },
    { label: "Monitor name provided", complete: hasName },
    { label: "Endpoint URL provided", complete: hasUrl },
  ];

  return (
    <div className="mt-3 rounded-lg border border-sf-border bg-sf-surface p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-sf-text">Required fields</h3>
        <span className="font-mono text-xs text-sf-text-muted">
          {items.filter((item) => item.complete).length}/{items.length}
        </span>
      </div>
      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-2.5 text-xs">
            {item.complete ? (
              <CheckCircle2 className="size-3.5 text-sf-green" />
            ) : (
              <Circle className="size-3.5 text-sf-text-muted" />
            )}
            <span className={item.complete ? "text-sf-text-sub" : "text-sf-text-muted"}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const NewMonitorProperties = () => {
  const {
    register,
    setValue,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<monitorInfoProps>({
    resolver: zodResolver(monitorInfoSchema),
    defaultValues: {
      httpMethod: "GET",
      intervalSeconds: "5m",
      monitorType: "https",
      requestTimeoutMS: 5000,
      requestBodyType: "none",
      contentType: "none",
      requestBody: null,
      statusCodes: [200],
      failureThreshold: 2,
      recoveryThreshold: 2,
    }
  });

  const [monitorType, setMonitorType] = useState("HTTP/HTTPS");

  const [monitorName, url, statusCodes, httpMethod, intervalSeconds] = useWatch({
    control,
    name: [
      "monitorName",
      "url",
      "statusCodes",
      "httpMethod",
      "intervalSeconds",
    ] as const,
  });

  const { mutate, isPending } = useUrlRegister();

  const onSubmit = (data: monitorInfoProps) => {
    const submittedMonitorType: monitorInfoProps["monitorType"] =
      new URL(data.url).protocol === "http:"
      ? "http"
      : "https";

    const urlDetails = {
      url: data.url,
      monitorName: data.monitorName,
      intervalSeconds: intervalToSeconds(data.intervalSeconds),
      contentType: data.contentType,
      failureThreshold: data.failureThreshold,
      httpMethod: data.httpMethod,
      requestBody: data.requestBody,
      requestBodyType: data.requestBodyType,
      requestTimeoutMS: data.requestTimeoutMS,
      statusCodes: data.statusCodes,
      monitorType: submittedMonitorType,
      recoveryThreshold: data.recoveryThreshold,
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
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-4 sm:px-6 sm:py-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-sf-text">
              Monitor configuration
            </h2>
            <p className="mt-1 text-xs text-sf-text-muted">
              Define the endpoint first, then review request behavior and alert delivery.
            </p>
          </div>
          <MonitorTypeInfo
            selected={monitorType}
            onSelect={setMonitorType}
            error={errors.monitorType?.message}
          />
          <MonitorInfo
            register={register}
            errors={{
              errorsMonitorName: errors.monitorName?.message,
              errorsMonitorUrl: errors.url?.message,
            }}
          />
          <RequestType
            watch={watch}
            control={control}
            register={register}
            setValue={setValue}
            errors={{
              errorsStatusCodes: errors.statusCodes?.message,
              errorsHttpMethod: errors.httpMethod?.message,
              errorsRequestBodyType: errors.requestBodyType?.message,
              errorsContentType: errors.contentType?.message,
              errorsRequestBody: errors.requestBody?.message,
              errorsRequestTimeoutMS: errors.requestTimeoutMS?.message,
            }}
          />
          <CheckInterval
            control={control}
            error={errors.intervalSeconds?.message}
          />
          <MonitoringRegions />
          <AlertConditions
            control={control}
            errors={{
              failureThreshold: errors.failureThreshold?.message,
              recoveryThreshold: errors.recoveryThreshold?.message,
            }}
          />
          <Notifications />
        </div>
        <aside className="h-fit w-full xl:sticky xl:top-6">
          <div className="mb-3">
            <h2 className="text-sm font-semibold text-sf-text">Review</h2>
            <p className="mt-1 text-xs text-sf-text-muted">
              Confirm the effective check configuration before creating it.
            </p>
          </div>
          <MonitorPreview
            monitorName={monitorName}
            url={url}
            type={monitorType}
            interval={intervalSeconds ?? "5m"}
            method={(httpMethod ?? "GET").toLowerCase()}
            statusCodes={statusCodes}
          />
          <SetupChecklist
            hasName={Boolean(monitorName?.trim())}
            hasUrl={Boolean(url?.trim())}
          />
        </aside>
      </div>
    </div>
  );
};

export default NewMonitorProperties;
