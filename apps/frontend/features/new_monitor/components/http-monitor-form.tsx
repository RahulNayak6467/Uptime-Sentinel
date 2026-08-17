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
import AdditionalChecks, { AdditionalChecksState } from "./additional-checks/additional-checks";
import SetupChecklist from "./setup-checklist";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { httpMonitorProps, httpMonitorSchema } from "../schemas/monitor-info";
import { checkIntervals } from "../data";
import { useUrlRegister } from "../hooks/useUrlRegister";
import { useTlsRegister } from "../hooks/useTlsRegister";
import { intervalToSeconds } from "../utils/interval";
import { checkIntervalsTypeProps, tlsRegisterPayloadProps } from "../types";
import { ApiError } from "next/dist/server/api-utils";
import { toast } from "sonner";

type HttpMonitorFormProps = {
  monitorType: string;
  onSelectType: (type: string) => void;
};

const HttpMonitorForm = ({ monitorType, onSelectType }: HttpMonitorFormProps) => {
  const {
    register,
    setValue,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<httpMonitorProps>({
    resolver: zodResolver(httpMonitorSchema),
    defaultValues: {
      httpMethod: "GET",
      intervalSeconds: "5m",
      monitorType: "https",
      requestTimeoutMS: 5000,
      responseTimeThresholdMS: 1000,
      requestBodyType: "none",
      contentType: "none",
      requestBody: null,
      statusCodes: [200],
      failureThreshold: 2,
      recoveryThreshold: 2,
    },
  });

  const [monitorName, url, statusCodes, httpMethod, intervalSeconds] = useWatch({
    control,
    name: ["monitorName", "url", "statusCodes", "httpMethod", "intervalSeconds"] as const,
  });

  const [additionalChecks, setAdditionalChecks] = useState<AdditionalChecksState | null>(null);

  const { mutate, isPending } = useUrlRegister();
  const { mutate: registerTls } = useTlsRegister();

  const buildTlsAddon = (
    data: httpMonitorProps,
    linkedMonitorId: string,
  ): tlsRegisterPayloadProps | null => {
    if (!additionalChecks?.enabled.tls) return null;

    const cfg = additionalChecks.config.tls;
    const host = cfg.host.trim() || new URL(data.url).hostname;
    const expiryAlertThresholds = cfg.expiryAlerts
      .split(",")
      .map((part) => Number(part.trim()))
      .filter((day) => Number.isFinite(day));

    return {
      monitorType: "tls",
      url: host,
      monitorName: data.monitorName,
      intervalSeconds: intervalToSeconds(cfg.interval as checkIntervalsTypeProps),
      requestTimeoutMS: Number(cfg.timeout),
      responseTimeThresholdMS: 5000,
      port: Number(cfg.port),
      minTlsVersion: cfg.minVersion as tlsRegisterPayloadProps["minTlsVersion"],
      warningThresholdDays: Number(cfg.warningDays),
      expiryAlertThresholds,
      linkedMonitorId,
    };
  };

  const onSubmit = (data: httpMonitorProps) => {
    const submittedMonitorType: httpMonitorProps["monitorType"] =
      new URL(data.url).protocol === "http:" ? "http" : "https";

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
      responseTimeThresholdMS: data.responseTimeThresholdMS,
      statusCodes: data.statusCodes,
      monitorType: submittedMonitorType,
      recoveryThreshold: data.recoveryThreshold,
    };

    mutate(urlDetails, {
      onSuccess: (monitorId) => {
        toast.success("Url is registered");

        const tlsAddon = buildTlsAddon(data, monitorId);
        if (tlsAddon) {
          registerTls(tlsAddon, {
            onSuccess: () => {
              toast.success("TLS monitor is registered");
            },
            onError: (err) => {
              console.log(err);
              toast.error(
                err instanceof ApiError ? err.message : err.message,
              );
            },
          });
        }
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
            onSelect={onSelectType}
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
            intervals={checkIntervals}
          />
          <AdditionalChecks onChange={setAdditionalChecks} />
          <MonitoringRegions />
          <AlertConditions
            control={control}
            errors={{
              failureThreshold: errors.failureThreshold?.message,
              recoveryThreshold: errors.recoveryThreshold?.message,
              responseTimeThresholdMS: errors.responseTimeThresholdMS?.message,
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

export default HttpMonitorForm;
