"use client";

import { useState } from "react";
import { Plus, Save, X } from "lucide-react";
import type { IndividualOverviewStatsProps } from "../types";
import {
  editMonitorIntervals,
  formInputClass,
  secondaryButtonClass,
} from "./constants";
import { Field } from "./components/form-controls";
import { useEditConfig } from "../hooks/useEditConfig";
import type { editConfigMonitorProps } from "../types";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  editSchema,
  type editSchemaInputProps,
  type editSchemaProps,
} from "../schema/editSchema";
import ErrorMessage from "@/features/auth/error";
import { useEditMonitorConfig } from "../hooks/useEditMonitorConfig";
import { toast } from "sonner";
import { ApiError } from "next/dist/server/api-utils";
import { intervalToSeconds } from "@/features/new_monitor/utils/interval";
import { bodyTypes } from "@/features/new_monitor/data";
import { useWatch } from "react-hook-form";
import EditTlsMonitorForm from "./edit-tls-monitor-form";

const HTTP_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"] as const;

const getMonitorStatusMeta = (monitor: IndividualOverviewStatsProps) => {
  if (!monitor.isActive) {
    return {
      label: "Paused",
      badge: "border-sf-border bg-sf-bg text-sf-text-muted",
    };
  }

  if (monitor.status === "UP") {
    return {
      label: "Operational",
      badge: "border-sf-green-border bg-sf-green-bg text-sf-green",
    };
  }

  if (monitor.status === "DOWN") {
    return {
      label: "Down",
      badge: "border-sf-red-border bg-sf-red-bg text-sf-red",
    };
  }

  return {
    label: "Pending first check",
    badge: "border-sf-amber-border bg-sf-amber-bg text-sf-amber",
  };
};

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

const EditMonitorForm = ({
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
  const [statusCodeInput, setStatusCodeInput] = useState("");
  const [statusCodeInputError, setStatusCodeInputError] = useState<string>();

  const defaultInterval =
    editMonitorIntervals.find(
      (interval) => interval.seconds === config.intervalSeconds,
    )?.value ?? "1h";

    const {
      register,
      control,
      setValue,
      handleSubmit,
      formState: { errors, dirtyFields },
    } = useForm<editSchemaInputProps, unknown, editSchemaProps>({
      resolver: zodResolver(editSchema),
      defaultValues: {
        monitorName: config.monitorName,
        url: config.url,
        intervalSeconds: defaultInterval,
        requestTimeoutMS: config.requestTimeoutMS,
        responseTimeThresholdMS: config.responseTimeThresholdMS,
        httpMethod: config.httpMethod ?? "GET",
        statusCodes: config.statusCode ?? [200],
        failureThreshold: config.failureThreshold,
        recoveryThreshold: config.recoveryThreshold,
        contentType: config.contentType ?? "none",
        requestBodyType: config.requestBodyType ?? "none",
        requestBody: config.requestBody ?? null,
      },
    });

  const statusMeta = getMonitorStatusMeta(monitor);
  const selectedHttpMethod = useWatch({
    control,
    name: "httpMethod",
    defaultValue: config.httpMethod ?? "GET",
  });
  const selectedRequestBodyType = useWatch({
    control,
    name: "requestBodyType",
    defaultValue: config.requestBodyType ?? "none",
  });

  const { mutate, isPending } = useEditMonitorConfig(id);
  const onSubmit = (data: editSchemaProps) => {
    const keys = Object.keys(dirtyFields) as (keyof editSchemaProps)[];
    const editMonitorData = keys.reduce<Record<string, unknown>>((acc, el) => {
      if (el === "intervalSeconds") {
        acc.intervalSeconds = intervalToSeconds(data.intervalSeconds);
      } else {
        acc[el] = data[el];
      }
      return acc;
    }, {});
    mutate(editMonitorData as editConfigMonitorProps, {
      onSuccess: () => {
        toast.success("Monitor successfully updated")
        onClose()
      },
      onError: (err) => {
        if (err instanceof ApiError) {
          toast.error(err.message);
        } else {
          toast.error("Something went wrong. Please try again.");
        }
      },
    }
    )
  }


  return (
    <div className="animate-sf-modal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-3 py-4 backdrop-blur-sm motion-reduce:animate-none">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-monitor-title"
        className="animate-sf-modal-enter flex max-h-[90dvh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-sf-border bg-sf-surface shadow-sf-card motion-reduce:animate-none"
      >
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-sf-border px-5 py-3.5 sm:px-6">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2
                id="edit-monitor-title"
                className="text-lg font-semibold tracking-sf-tight text-sf-text"
              >
                Edit monitor
              </h2>
              <span
                className={`rounded-sf border px-2 py-0.5 text-xs font-semibold ${statusMeta.badge}`}
              >
                {statusMeta.label}
              </span>
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
                description="Update the monitor identity, endpoint, and check schedule."
              />
              <div className="grid gap-3.5 sm:grid-cols-2">
                <Field label="Monitor name">
                  <>
                    <input
                      {...register("monitorName")}
                      required
                      minLength={2}
                      maxLength={50}
                      className={formInputClass}
                      defaultValue={config.monitorName}
                    />
                    <ErrorMessage error={errors.monitorName?.message} />
                  </>
                </Field>
                <Field label="URL">
                  <>
                    <input
                      {...register("url")}
                      required
                      type="url"
                      className={formInputClass}
                      defaultValue={config.url}
                    />
                    <ErrorMessage error={errors.url?.message} />
                  </>
                </Field>
              </div>

              <div className="space-y-3.5">
                <Field label="Check interval">
                  <Controller
                    name="intervalSeconds"
                    control={control}
                    defaultValue={defaultInterval}
                    render={({ field }) => (
                      <>
                        <div className="flex flex-wrap gap-2">
                          {editMonitorIntervals.map((interval) => (
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
                      </>
                    )}
                  />
                  <ErrorMessage error={errors.intervalSeconds?.message} />
                </Field>

                <div className="grid gap-3.5 sm:grid-cols-2">
                <Field label="Request timeout" hint="Fails after this duration">
                  <div>
                    <div className="relative">
                      <input
                        {...register("requestTimeoutMS")}
                        required
                        type="number"
                        min={1000}
                        max={60000}
                        step={1000}
                        className={`${formInputClass} pr-12`}
                        defaultValue={config.requestTimeoutMS}
                      />
                      <span className="pointer-events-none absolute right-3 top-2.5 text-xs text-sf-text-muted">
                        ms
                      </span>
                    </div>
                    <ErrorMessage error={errors.requestTimeoutMS?.message} />
                  </div>
                </Field>
                <Field label="HTTP method">
                  <>
                    <Controller
                      name="httpMethod"
                      control={control}
                      defaultValue={config.httpMethod ?? "GET"}
                      render={({ field }) => (
                        <div className="flex flex-wrap gap-1.5">
                          {HTTP_METHODS.map((method) => (
                            <button
                              key={method}
                              type="button"
                              onClick={() => {
                                field.onChange(method);

                                if (method === "GET") {
                                  setValue("requestBodyType", "none", {
                                    shouldDirty: true,
                                  });
                                  setValue("contentType", "none", {
                                    shouldDirty: true,
                                  });
                                  setValue("requestBody", null, {
                                    shouldDirty: true,
                                  });
                                }
                              }}
                              className={`h-8 cursor-pointer rounded-md border px-2.5 font-mono text-xs font-semibold transition-colors ${
                                field.value === method
                                  ? "border-sf-blue bg-sf-blue text-white"
                                  : "border-sf-border bg-sf-surface text-sf-text hover:border-sf-text-muted"
                              }`}
                            >
                              {method}
                            </button>
                          ))}
                        </div>
                      )}
                    />
                    <ErrorMessage error={errors.httpMethod?.message} />
                  </>
                </Field>
                </div>

                {selectedHttpMethod !== "GET" && (
                  <div className="space-y-4 rounded-lg border border-sf-border bg-sf-bg p-4">
                    <div>
                      <h3 className="text-sm font-semibold text-sf-text">
                        Request body
                      </h3>
                      <p className="mt-0.5 text-xs text-sf-text-muted">
                        Configure the optional payload sent with the {selectedHttpMethod} request.
                      </p>
                    </div>

                    <Controller
                      name="requestBodyType"
                      control={control}
                      render={({ field }) => (
                        <div>
                          <div className="flex flex-wrap gap-2">
                            {bodyTypes.map((bodyType) => (
                              <button
                                key={bodyType.id}
                                type="button"
                                onClick={() => {
                                  field.onChange(bodyType.id);
                                  setValue("contentType", bodyType.contentType, {
                                    shouldDirty: true,
                                    shouldValidate: true,
                                  });

                                  if (bodyType.id === "none") {
                                    setValue("requestBody", null, {
                                      shouldDirty: true,
                                      shouldValidate: true,
                                    });
                                  }
                                }}
                                className={`rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors ${
                                  field.value === bodyType.id
                                    ? "border-sf-text bg-sf-text text-sf-btn-text"
                                    : "cursor-pointer border-sf-border bg-sf-surface text-sf-text-sub hover:border-sf-text-muted hover:text-sf-text"
                                }`}
                              >
                                {bodyType.label}
                              </button>
                            ))}
                          </div>
                          <ErrorMessage error={errors.requestBodyType?.message} />
                        </div>
                      )}
                    />

                    {selectedRequestBodyType !== "none" && (
                      <div className="grid gap-3.5 sm:grid-cols-2">
                        <Field label="Content-Type" hint="Set from the selected body format">
                          <>
                            <Controller
                              name="contentType"
                              control={control}
                              render={({ field }) => (
                                <div className="flex h-9 items-center rounded-md border border-sf-border bg-sf-bg/35 px-3 font-mono text-[13px] text-sf-text-muted">
                                  {field.value}
                                </div>
                              )}
                            />
                            <ErrorMessage error={errors.contentType?.message} />
                          </>
                        </Field>

                        <div className="sm:col-span-2">
                          <Field label="Body content">
                            <>
                              <textarea
                                {...register("requestBody")}
                                rows={6}
                                placeholder={
                                  selectedRequestBodyType === "json"
                                    ? '{"example":true}'
                                    : "Enter the request body"
                                }
                                className="w-full resize-y rounded-md border border-sf-border bg-sf-surface px-3 py-2.5 font-mono text-[13px] text-sf-text outline-none transition-colors placeholder:text-sf-text-muted focus:border-sf-text-sub focus:shadow-sf-focus"
                              />
                              <ErrorMessage error={errors.requestBody?.message} />
                            </>
                          </Field>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </section>

            <section className="space-y-3 rounded-lg border border-sf-border bg-sf-bg/20 p-4">
              <SectionHeading
                title="Health rules"
                description="Choose which responses count as healthy and when state changes."
              />
              <div className="grid items-start gap-3.5 md:grid-cols-4">
                <div className="md:col-span-2">
                  <Field label="Expected status codes" hint="Valid range: 100–599">
                    <Controller
                      name="statusCodes"
                      control={control}
                      defaultValue={config.statusCode}
                      render={({ field }) => {
                        const addStatusCode = () => {
                          const parsedCode = Number(statusCodeInput.trim());

                          if (
                            !Number.isInteger(parsedCode) ||
                            parsedCode < 100 ||
                            parsedCode > 599
                          ) {
                            setStatusCodeInputError(
                              "Enter a whole-number status code from 100 to 599",
                            );
                            return;
                          }

                          if (field.value.includes(parsedCode)) {
                            setStatusCodeInputError(
                              "This status code has already been added",
                            );
                            return;
                          }

                          field.onChange([...field.value, parsedCode]);
                          setStatusCodeInput("");
                          setStatusCodeInputError(undefined);
                        };

                        return (
                          <>
                            <div className="flex gap-2">
                              <input
                                type="number"
                                min={100}
                                max={599}
                                value={statusCodeInput}
                                onChange={(event) => {
                                  setStatusCodeInput(event.target.value);
                                  setStatusCodeInputError(undefined);
                                }}
                                onKeyDown={(event) => {
                                  if (event.key === "Enter") {
                                    event.preventDefault();
                                    addStatusCode();
                                  }
                                }}
                                placeholder="200"
                                className={`${formInputClass} min-w-0 flex-1 font-mono`}
                              />
                              <button
                                type="button"
                                onClick={addStatusCode}
                                className={secondaryButtonClass}
                              >
                                <Plus className="size-3.5" />
                                Add
                              </button>
                            </div>

                            <div className="mt-2 flex min-h-6 flex-wrap gap-1.5">
                              {field.value.map((code) => (
                                <span
                                  key={code}
                                  className="inline-flex items-center gap-1.5 rounded-sf border border-sf-border bg-sf-surface px-2 py-0.5 font-mono text-xs text-sf-text"
                                >
                                  {code}
                                  <button
                                    type="button"
                                    aria-label={`Remove status code ${code}`}
                                    onClick={() =>
                                      field.onChange(
                                        field.value.filter(
                                          (value) => value !== code,
                                        ),
                                      )
                                    }
                                    className="cursor-pointer text-sf-text-muted transition-colors hover:text-sf-red"
                                  >
                                    ×
                                  </button>
                                </span>
                              ))}
                            </div>

                            <ErrorMessage
                              error={
                                statusCodeInputError ??
                                errors.statusCodes?.message
                              }
                            />
                          </>
                        );
                      }}
                    />
                  </Field>
                </div>
                <Field
                  label="Failure threshold"
                  hint="Checks before down"
                >
                  <>
                    <input
                      {...register("failureThreshold")}
                      required
                      type="number"
                      min={1}
                      max={10}
                      className={formInputClass}
                      defaultValue={config.failureThreshold}
                    />
                    <ErrorMessage error={errors.failureThreshold?.message} />
                  </>
                </Field>
                <Field
                  label="Recovery threshold"
                  hint="Checks before recovery"
                >
                  <>
                    <input
                      {...register("recoveryThreshold")}
                      required
                      type="number"
                      min={1}
                      max={10}
                      className={formInputClass}
                      defaultValue={config.recoveryThreshold}
                    />
                    <ErrorMessage error={errors.recoveryThreshold?.message} />
                  </>
                </Field>
                <div className="md:col-span-2">
                  <Field
                    label="Response-time threshold"
                    hint="Latency that moves the chart into the red zone"
                  >
                    <div>
                      <div className="relative">
                        <input
                          {...register("responseTimeThresholdMS")}
                          required
                          type="number"
                          min={1}
                          max={60000}
                          className={`${formInputClass} pr-12`}
                          defaultValue={config.responseTimeThresholdMS}
                        />
                        <span className="pointer-events-none absolute right-3 top-2.5 text-xs text-sf-text-muted">
                          ms
                        </span>
                      </div>
                      <ErrorMessage
                        error={errors.responseTimeThresholdMS?.message}
                      />
                    </div>
                  </Field>
                </div>
              </div>
            </section>
          </div>

          <footer className="flex shrink-0 flex-col-reverse gap-2 border-t border-sf-border bg-sf-surface px-5 py-3 sm:flex-row sm:items-center sm:justify-end sm:px-6">
            <button
              type="button"
              onClick={onClose}
              className={secondaryButtonClass}
            >
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

export const EditMonitorModal = ({
  id,
  monitor,
  onClose,
}: {
  id: string;
  monitor: IndividualOverviewStatsProps;
  onClose: () => void;
}) => {
  const { data, isLoading, isError } = useEditConfig(id);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-3 py-4 backdrop-blur-sm">
        <div className="rounded-lg border border-sf-border bg-sf-surface px-6 py-5 text-sm text-sf-text-muted shadow-sf-card">
          Loading monitor configuration…
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-3 py-4 backdrop-blur-sm">
        <div className="rounded-lg border border-sf-red-border bg-sf-surface px-6 py-5 text-sm text-sf-red shadow-sf-card">
          Could not load the monitor configuration.
        </div>
      </div>
    );
  }

  if (monitor.monitorType === "tls") {
    return (
      <EditTlsMonitorForm id={id} monitor={monitor} config={data} onClose={onClose} />
    );
  }

  return <EditMonitorForm id={id} monitor={monitor} config={data} onClose={onClose} />;
};
