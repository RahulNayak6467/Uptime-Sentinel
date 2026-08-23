"use client";

import CheckInterval from "./check-interval/check-interval";
import MonitorInfo from "./monitor-info/monitor-info";
import MonitorPreview from "./monitor-preview/monitor-preview";
import MonitorTypeInfo from "./monitor-types/monitor-type-info";
import NewMonitorHeader from "./monitor-types/new-monitor-header";
import Notifications from "./notifications/notifications";
import TlsSettings from "./tls-settings/tls-settings";
import SetupChecklist from "./setup-checklist";
import SectionHeader from "./section-header";
import ErrorMessage from "@/features/auth/error";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { tlsMonitorProps, tlsMonitorSchema } from "../schemas/monitor-info";
import { tlsCheckIntervals, tlsAlertEvents, defaultTlsAlertEvents } from "../data";
import { useTlsRegister } from "../hooks/useTlsRegister";
import { tlsRegisterPayloadProps } from "../types";
import { intervalToSeconds } from "../utils/interval";
import { ApiError } from "next/dist/server/api-utils";
import { toast } from "sonner";

type TlsMonitorFormProps = {
  monitorType: string;
  onSelectType: (type: string) => void;
};

const TlsMonitorForm = ({ monitorType, onSelectType }: TlsMonitorFormProps) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<tlsMonitorProps>({
    resolver: zodResolver(tlsMonitorSchema),
    defaultValues: {
      monitorType: "tls",
      intervalSeconds: "12h",
      minTlsVersion: "TLSv1.2",
      port: 443,
      requestTimeoutMS: 10000,
      responseTimeThresholdMS: 5000,
      warningThresholdDays: 30,
      expiryAlertThresholds: "30, 14, 7, 1",
      enabledAlerts: defaultTlsAlertEvents,
    },
  });

  const [monitorName, url, intervalSeconds] = useWatch({
    control,
    name: ["monitorName", "url", "intervalSeconds"] as const,
  });

  const { mutate, isPending } = useTlsRegister();

  const onSubmit = (data: tlsMonitorProps) => {
    const expiryAlertThresholds = data.expiryAlertThresholds
      .split(",")
      .map((part) => Number(part.trim()))
      .filter((day) => Number.isFinite(day));

    const tlsDetails: tlsRegisterPayloadProps = {
      monitorType: "tls",
      url: data.url,
      monitorName: data.monitorName,
      intervalSeconds: intervalToSeconds(data.intervalSeconds),
      requestTimeoutMS: data.requestTimeoutMS,
      responseTimeThresholdMS: data.responseTimeThresholdMS,
      port: data.port,
      minTlsVersion: data.minTlsVersion,
      warningThresholdDays: data.warningThresholdDays,
      expiryAlertThresholds,
      enabledAlerts: data.enabledAlerts,
      linkedMonitorId: null,
    };

    mutate(tlsDetails, {
      onSuccess: () => {
        toast.success("TLS monitor is registered");
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
              Point at the certificate host, then set the expiry policy and check cadence.
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
            urlLabel="Host"
            urlPlaceholder="example.com"
            urlInputType="text"
          />
          <TlsSettings
            register={register}
            errors={{
              port: errors.port?.message,
              minTlsVersion: errors.minTlsVersion?.message,
              requestTimeoutMS: errors.requestTimeoutMS?.message,
              warningThresholdDays: errors.warningThresholdDays?.message,
              expiryAlertThresholds: errors.expiryAlertThresholds?.message,
            }}
          />
          <CheckInterval
            control={control}
            error={errors.intervalSeconds?.message}
            intervals={tlsCheckIntervals}
          />
          <div className="mt-4 w-full">
            <div className="h-full w-full overflow-hidden rounded-lg border border-sf-border bg-sf-surface shadow-sm">
              <SectionHeader
                step="05"
                title="Handshake threshold"
                description="Flag the check as slow when the TLS handshake exceeds this"
              />
              <div className="flex flex-col justify-between gap-3 px-5 py-4 sm:flex-row sm:items-center">
                <div>
                  <p className="font-sans text-[14px] font-semibold text-sf-text">
                    Slow-handshake threshold
                  </p>
                  <p className="font-sans text-[12px] text-sf-text-muted">
                    Handshake time that moves the latency chart into the red zone
                  </p>
                </div>
                <div className="shrink-0">
                  <div className="relative w-36">
                    <input
                      {...register("responseTimeThresholdMS", { valueAsNumber: true })}
                      type="number"
                      min={1}
                      max={60000}
                      className="h-9 w-full rounded-md border border-sf-border bg-sf-surface px-3 pr-10 text-[13px] text-sf-text outline-none transition-colors focus:border-sf-text-sub focus:shadow-sf-focus"
                    />
                    <span className="pointer-events-none absolute right-3 top-2.5 text-xs text-sf-text-muted">
                      ms
                    </span>
                  </div>
                  <ErrorMessage error={errors.responseTimeThresholdMS?.message} />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 w-full">
            <div className="h-full w-full overflow-hidden rounded-lg border border-sf-border bg-sf-surface shadow-sm">
              <SectionHeader
                step="06"
                title="Alert events"
                description="Choose which certificate events should trigger an alert"
              />
              <Controller
                name="enabledAlerts"
                control={control}
                render={({ field }) => (
                  <div className="grid gap-2 p-5 sm:grid-cols-2">
                    {tlsAlertEvents.map((event) => {
                      const checked = field.value?.includes(event.id) ?? false;
                      return (
                        <label
                          key={event.id}
                          className="flex cursor-pointer items-start gap-2.5 rounded-md border border-sf-border bg-sf-bg/40 px-3 py-2.5 transition-colors hover:border-sf-text-muted"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e) => {
                              const next = e.target.checked
                                ? [...(field.value ?? []), event.id]
                                : (field.value ?? []).filter((id) => id !== event.id);
                              field.onChange(next);
                            }}
                            className="mt-0.5 size-4 shrink-0 accent-sf-blue"
                          />
                          <span className="min-w-0">
                            <span className="block text-[13px] font-medium text-sf-text">
                              {event.label}
                            </span>
                            <span className="block text-[12px] text-sf-text-muted">
                              {event.description}
                            </span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}
              />
              <div className="px-5 pb-4">
                <ErrorMessage error={errors.enabledAlerts?.message} />
              </div>
            </div>
          </div>
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
            interval={intervalSeconds ?? "12h"}
            method="—"
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

export default TlsMonitorForm;
