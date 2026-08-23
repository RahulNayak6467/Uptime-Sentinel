"use client";

import { Save, X } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ApiError } from "next/dist/server/api-utils";
import ErrorMessage from "@/features/auth/error";
import { tlsAlertEvents } from "@/features/new_monitor/data";
import type { IndividualOverviewStatsProps, editConfigMonitorProps } from "../types";
import { editTlsIntervals, formInputClass, secondaryButtonClass } from "./constants";
import { Field } from "./components/form-controls";
import { useEditMonitorConfig } from "../hooks/useEditMonitorConfig";
import {
  editTlsSchema,
  type editTlsSchemaInputProps,
  type editTlsSchemaProps,
} from "../schema/editTlsSchema";

const TLS_VERSIONS = ["TLSv1", "TLSv1.1", "TLSv1.2", "TLSv1.3"] as const;

const SectionHeading = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <div>
    <h3 className="text-sm font-semibold text-sf-text">{title}</h3>
    <p className="mt-0.5 text-xs text-sf-text-muted">{description}</p>
  </div>
);

const EditTlsMonitorForm = ({
  id,
  monitor,
  config,
  onClose,
}: {
  id: string;
  monitor: IndividualOverviewStatsProps;
  config: editConfigMonitorProps;
  onClose: () => void;
}) => {
  const defaultInterval =
    editTlsIntervals.find((interval) => interval.seconds === config.intervalSeconds)
      ?.value ?? "12h";

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, dirtyFields },
  } = useForm<editTlsSchemaInputProps, unknown, editTlsSchemaProps>({
    resolver: zodResolver(editTlsSchema),
    defaultValues: {
      monitorName: config.monitorName,
      url: config.url,
      intervalSeconds: defaultInterval,
      requestTimeoutMS: config.requestTimeoutMS,
      responseTimeThresholdMS: config.responseTimeThresholdMS,
      port: config.port ?? 443,
      minTlsVersion: config.minTlsVersion ?? "TLSv1.2",
      warningThresholdDays: config.warningThresholdDays ?? 30,
      expiryAlertThresholds: (config.expiryAlertThresholds ?? [30, 14, 7, 1]).join(", "),
      enabledAlerts: (config.enabledAlerts ??
        tlsAlertEvents.map((event) => event.id)) as editTlsSchemaInputProps["enabledAlerts"],
    },
  });

  const { mutate, isPending } = useEditMonitorConfig(id);

  const onSubmit = (data: editTlsSchemaProps) => {
    const payload: editConfigMonitorProps = { monitorType: "tls" };

    if (dirtyFields.monitorName) payload.monitorName = data.monitorName;
    if (dirtyFields.url) payload.url = data.url;
    if (dirtyFields.intervalSeconds) {
      payload.intervalSeconds = editTlsIntervals.find(
        (interval) => interval.value === data.intervalSeconds,
      )?.seconds;
    }
    if (dirtyFields.requestTimeoutMS) payload.requestTimeoutMS = data.requestTimeoutMS;
    if (dirtyFields.responseTimeThresholdMS)
      payload.responseTimeThresholdMS = data.responseTimeThresholdMS;
    if (dirtyFields.port) payload.port = data.port;
    if (dirtyFields.minTlsVersion) payload.minTlsVersion = data.minTlsVersion;
    if (dirtyFields.warningThresholdDays)
      payload.warningThresholdDays = data.warningThresholdDays;
    if (dirtyFields.expiryAlertThresholds) {
      payload.expiryAlertThresholds = data.expiryAlertThresholds
        .split(",")
        .map((part) => Number(part.trim()))
        .filter((day) => Number.isFinite(day));
    }
    if (dirtyFields.enabledAlerts) payload.enabledAlerts = data.enabledAlerts;

    const hasChange = Object.keys(payload).some((key) => key !== "monitorType");
    if (!hasChange) {
      toast.info("No changes to save");
      return;
    }

    mutate(payload, {
      onSuccess: () => {
        toast.success("Monitor successfully updated");
        onClose();
      },
      onError: (err) => {
        if (err instanceof ApiError) {
          toast.error(err.message);
        } else {
          toast.error("Something went wrong. Please try again.");
        }
      },
    });
  };

  return (
    <div className="animate-sf-modal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-3 py-4 backdrop-blur-sm motion-reduce:animate-none">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-tls-monitor-title"
        className="animate-sf-modal-enter flex max-h-[90dvh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-sf-border bg-sf-surface shadow-sf-card motion-reduce:animate-none"
      >
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-sf-border px-5 py-3.5 sm:px-6">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2
                id="edit-tls-monitor-title"
                className="text-lg font-semibold tracking-sf-tight text-sf-text"
              >
                Edit monitor
              </h2>
              <span className="rounded-sf border border-sf-border bg-sf-bg px-2 py-0.5 text-xs font-semibold text-sf-text-muted">
                {monitor.monitorType.toUpperCase()}
              </span>
            </div>
            <p className="mt-1 truncate font-mono text-xs text-sf-text-muted">
              {config.url}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close edit monitor modal"
            className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-sf-text-muted transition-colors hover:bg-sf-bg hover:text-sf-text"
          >
            <X className="size-4" />
          </button>
        </header>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex min-h-0 flex-1 flex-col overflow-hidden"
        >
          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-4 sm:px-6">
            <section className="space-y-3 rounded-lg border border-sf-border bg-sf-bg/20 p-4">
              <SectionHeading
                title="Monitor details"
                description="Update the monitor identity, certificate host, and check schedule."
              />
              <div className="grid gap-3.5 sm:grid-cols-2">
                <Field label="Monitor name">
                  <>
                    <input {...register("monitorName")} className={formInputClass} />
                    <ErrorMessage error={errors.monitorName?.message} />
                  </>
                </Field>
                <Field label="Host">
                  <>
                    <input {...register("url")} className={`${formInputClass} font-mono`} />
                    <ErrorMessage error={errors.url?.message} />
                  </>
                </Field>
              </div>

              <Field label="Check interval">
                <Controller
                  name="intervalSeconds"
                  control={control}
                  render={({ field }) => (
                    <div className="flex flex-wrap gap-2">
                      {editTlsIntervals.map((interval) => (
                        <button
                          key={interval.value}
                          type="button"
                          onClick={() => field.onChange(interval.value)}
                          className={`h-8 min-w-14 cursor-pointer rounded-md border px-3 text-xs font-semibold transition-colors ${
                            field.value === interval.value
                              ? "border-sf-blue bg-sf-blue text-white"
                              : "border-sf-border bg-sf-surface text-sf-text hover:border-sf-text-muted"
                          }`}
                        >
                          {interval.label}
                        </button>
                      ))}
                    </div>
                  )}
                />
                <ErrorMessage error={errors.intervalSeconds?.message} />
              </Field>
            </section>

            <section className="space-y-3 rounded-lg border border-sf-border bg-sf-bg/20 p-4">
              <SectionHeading
                title="TLS & certificate settings"
                description="Connection target and certificate expiry policy."
              />
              <div className="grid gap-3.5 sm:grid-cols-2">
                <Field label="Port">
                  <>
                    <input
                      {...register("port")}
                      type="number"
                      min={1}
                      max={65535}
                      className={`${formInputClass} font-mono`}
                    />
                    <ErrorMessage error={errors.port?.message} />
                  </>
                </Field>
                <Field label="Minimum TLS version">
                  <>
                    <select {...register("minTlsVersion")} className={formInputClass}>
                      {TLS_VERSIONS.map((version) => (
                        <option key={version} value={version}>
                          {version}
                        </option>
                      ))}
                    </select>
                    <ErrorMessage error={errors.minTlsVersion?.message} />
                  </>
                </Field>
                <Field label="Connection timeout" hint="1,000–60,000 ms">
                  <div className="relative">
                    <input
                      {...register("requestTimeoutMS")}
                      type="number"
                      min={10000}
                      max={60000}
                      step={1000}
                      className={`${formInputClass} pr-12`}
                    />
                    <span className="pointer-events-none absolute right-3 top-2.5 text-xs text-sf-text-muted">
                      ms
                    </span>
                    <ErrorMessage error={errors.requestTimeoutMS?.message} />
                  </div>
                </Field>
                <Field label="Slow-handshake threshold" hint="Moves the chart into the red zone">
                  <div className="relative">
                    <input
                      {...register("responseTimeThresholdMS")}
                      type="number"
                      min={1}
                      max={60000}
                      className={`${formInputClass} pr-12`}
                    />
                    <span className="pointer-events-none absolute right-3 top-2.5 text-xs text-sf-text-muted">
                      ms
                    </span>
                    <ErrorMessage error={errors.responseTimeThresholdMS?.message} />
                  </div>
                </Field>
                <Field label="Warning threshold" hint="days before expiry">
                  <div className="relative">
                    <input
                      {...register("warningThresholdDays")}
                      type="number"
                      min={1}
                      max={365}
                      className={`${formInputClass} pr-14`}
                    />
                    <span className="pointer-events-none absolute right-3 top-2.5 text-xs text-sf-text-muted">
                      days
                    </span>
                    <ErrorMessage error={errors.warningThresholdDays?.message} />
                  </div>
                </Field>
                <Field
                  label="Expiry alert thresholds"
                  hint="Comma-separated days, e.g. 30, 14, 7, 1"
                >
                  <>
                    <input
                      {...register("expiryAlertThresholds")}
                      className={`${formInputClass} font-mono`}
                      placeholder="30, 14, 7, 1"
                    />
                    <ErrorMessage error={errors.expiryAlertThresholds?.message} />
                  </>
                </Field>
              </div>
            </section>

            <section className="space-y-3 rounded-lg border border-sf-border bg-sf-bg/20 p-4">
              <SectionHeading
                title="Alert events"
                description="Choose which certificate events should trigger an alert."
              />
              <Controller
                name="enabledAlerts"
                control={control}
                render={({ field }) => (
                  <div className="grid gap-2 sm:grid-cols-2">
                    {tlsAlertEvents.map((event) => {
                      const checked = field.value?.includes(event.id) ?? false;
                      return (
                        <label
                          key={event.id}
                          className="flex cursor-pointer items-start gap-2.5 rounded-md border border-sf-border bg-sf-surface px-3 py-2.5 transition-colors hover:border-sf-text-muted"
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
              <ErrorMessage error={errors.enabledAlerts?.message} />
            </section>
          </div>

          <footer className="flex shrink-0 flex-col-reverse gap-2 border-t border-sf-border bg-sf-surface px-5 py-3 sm:flex-row sm:items-center sm:justify-end sm:px-6">
            <button type="button" onClick={onClose} className={secondaryButtonClass}>
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex h-9 cursor-pointer items-center justify-center gap-2 rounded-[4px] bg-sf-text px-5 text-xs font-semibold text-sf-btn-text shadow-sm transition-colors hover:bg-sf-blue hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save className="size-3.5" />
              {isPending ? "Saving…" : "Save changes"}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
};

export default EditTlsMonitorForm;
