"use client";

import { useMemo } from "react";
import { CalendarDays, Clock, Minus, Plus } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar } from "@/components/ui/calendar";
import Modal from "@/components/ui/modal";
import {
  IncidentStatus,
  IncidentUpdate,
  IncidentUpdateStatus,
  PayloadAddProps,
  PayloadUpdateProps,
} from "../types";
import {
  buildIncidentUpdateSchema,
  CLOCK_TIME_REGEX,
  incidentUpdateFormProps,
} from "../schema/incidentSchema";

import { useIncidentAdd, useIncidentUpdate } from "../hooks/useIncidentUpdate";
import { toast } from "sonner";
import { ApiError } from "next/dist/server/api-utils";
import { getAvailableIncidentUpdateStatuses } from "../incident-update-flow";

type TimeMode = "now" | "custom";

const currentClockTime = () => {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, "0")}:${now
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
};

const UPDATE_STATUS_CONFIG: Record<
  IncidentUpdateStatus,
  { label: string; dot: string }
> = {
  detected: { label: "Detected", dot: "bg-sf-red" },
  investigating: { label: "Investigating", dot: "bg-sf-amber" },
  monitoring: { label: "Monitoring", dot: "bg-sf-blue" },
  resolved: { label: "Resolved", dot: "bg-sf-green" },
};

const UPDATE_STATUS_ORDER: IncidentUpdateStatus[] = [
  "detected",
  "investigating",
  "monitoring",
  "resolved",
];

type Props = {
  open: boolean;
  onClose: () => void;
  /** Raw DB id of the incident this update belongs to. */
  incidentId: string;
  service: string;
  overallStatus: IncidentStatus;
  startedAt: Date;
  updates: IncidentUpdate[];
  existingTitle: string | null;
  /** When set, the modal edits this note's message instead of creating one. */
  editUpdate?: IncidentUpdate;
};

const MESSAGE_MAX = 500;

const inputClass =
  "w-full px-3 py-2 text-[13px] font-sans bg-sf-bg border border-sf-border rounded-sf text-sf-text placeholder:text-sf-text-muted focus:outline-none focus:ring-2 focus:ring-sf-text/10 focus:border-sf-text-sub transition-colors";

const labelClass =
  "text-[12px] font-semibold font-sans text-sf-text-sub uppercase tracking-wide";

const sectionLabelClass =
  "text-[10px] font-semibold font-sans text-sf-text-muted uppercase tracking-[0.06em]";

const overallBadge: Record<IncidentStatus, string> = {
  active: "bg-sf-red-bg text-sf-red border border-sf-red/30",
  resolved: "bg-sf-green-bg text-sf-green border border-sf-green/30",
};

const IncidentUpdateModal = ({
  open,
  onClose,
  incidentId,
  service,
  overallStatus,
  startedAt,
  updates,
  existingTitle,
  editUpdate,
}: Props) => {
  const isEdit = Boolean(editUpdate);

  const availableStatuses = useMemo(
    () => getAvailableIncidentUpdateStatuses(overallStatus, updates),
    [overallStatus, updates],
  );

  const schema = useMemo(
    () =>
      buildIncidentUpdateSchema({
        startedAt,
        incidentStatus: overallStatus,
        availableStatuses,
        isEdit,
      }),
    [startedAt, overallStatus, availableStatuses, isEdit],
  );

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isValid },
  } = useForm<incidentUpdateFormProps>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      title: existingTitle ?? "",
      status:
        editUpdate?.type ??
        availableStatuses[0] ??
        (overallStatus === "resolved" ? "resolved" : "detected"),
      message: editUpdate?.message ?? "",
      timeMode: "now",
      selectedDate: new Date(),
      customClockTime: currentClockTime(),
    },
  });

  const [status, message, timeMode, selectedDate, customClockTime] = useWatch({
    control,
    name: [
      "status",
      "message",
      "timeMode",
      "selectedDate",
      "customClockTime",
    ] as const,
  });

  const customTimeLocked = status === "detected" || status === "resolved";
  const clockTimeValid = CLOCK_TIME_REGEX.test(customClockTime);
  const customTimeError =
    errors.selectedDate?.message ?? errors.customClockTime?.message;

  const setClockTime = (value: string) => {
    setValue("customClockTime", value, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const adjustCustomTime = (minutesToAdd: number) => {
    if (!clockTimeValid) return;

    const [hour, minute] = customClockTime.split(":").map(Number);
    const totalMinutes = (hour * 60 + minute + minutesToAdd + 1440) % 1440;
    const nextHour = Math.floor(totalMinutes / 60);
    const nextMinute = totalMinutes % 60;
    setClockTime(
      `${nextHour.toString().padStart(2, "0")}:${nextMinute
        .toString()
        .padStart(2, "0")}`,
    );
  };

  const { mutate: addIncidentsMutation } = useIncidentAdd(incidentId);
  const { mutate: updateIncidentsMutation } = useIncidentUpdate(incidentId);

  const onSubmit = (data: incidentUpdateFormProps) => {
    let occurredAt: string | null = null;
    if (data.timeMode === "custom" && data.selectedDate) {
      const [hour, minute] = data.customClockTime.split(":").map(Number);
      const combined = new Date(data.selectedDate);
      combined.setHours(hour, minute, 0, 0);
      occurredAt = combined.toISOString();
    }

    console.log(incidentId);

    if (
      !isEdit &&
      (data.status === "investigating" || data.status === "monitoring")
    ) {
      const payload: PayloadAddProps = {
        type: data.status,
        title: data.title || null,
        message: data.message,
        occurredAt,
      };
      addIncidentsMutation(payload, {
        onSuccess: () => {
          toast.success("Incident updated");
          reset();
          onClose();
        },
        onError: (err) => {
          console.log(err);
          if (err instanceof ApiError) {
            toast.error(err.message);
          } else {
            toast.error("Something went wrong. Please try again.");
          }
        },
      });
    } else {
      const payload: PayloadUpdateProps = {
        type: data.status,
        title: data.title || null,
        message: data.message,
      };
      updateIncidentsMutation(payload, {
        onSuccess: () => {
          toast.success("Incident updated");
          reset();
          onClose();
        },
        onError: (err) => {
          console.log(err);
          if (err instanceof ApiError) {
            toast.error(err.message);
          } else {
            toast.error("Something went wrong. Please try again.");
          }
        },
      });
    }

  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit incident update" : "Log incident update"}
      description={
        isEdit
          ? "Update the note's message. Its status and timestamp are kept."
          : "Add a note to the incident timeline."
      }
      width="max-w-md"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex max-h-[70vh] flex-col gap-3 overflow-y-auto px-5 py-4">
          {/* Context banner — which incident this belongs to (read-only) */}
          <div className="flex items-center gap-2.5 rounded-sf border border-sf-border bg-sf-border-faint/50 px-3 py-2">
            <span className="text-[10px] font-semibold font-sans text-sf-text-muted uppercase tracking-wide">
              Incident
            </span>
            <span className="text-[13px] font-sans font-medium text-sf-text">
              {service}
            </span>
            <span
              className={`ml-auto text-xs font-semibold font-sans px-2 py-0.5 rounded-full ${overallBadge[overallStatus]}`}
            >
              {overallStatus === "active" ? "Active" : "Resolved"}
            </span>
          </div>

          {!isEdit && (
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Incident title</label>
              <input
                type="text"
                placeholder="e.g. Checkout API returning 500s"
                maxLength={100}
                {...register("title")}
                className={inputClass}
              />
              {errors.title ? (
                <p className="font-sans text-xs text-sf-red">
                  {errors.title.message}
                </p>
              ) : (
                <p className="font-sans text-xs text-sf-text-muted">
                  Optional — names the incident itself, not this note.
                </p>
              )}
            </div>
          )}

          <div className="flex flex-col gap-2.5">
            <span className={sectionLabelClass}>Timeline update</span>

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Status</label>
              <div className="grid grid-cols-2 gap-2">
                {UPDATE_STATUS_ORDER.map((s) => {
                  const cfg = UPDATE_STATUS_CONFIG[s];
                  const active = status === s;
                  const locked = isEdit
                    ? s !== status
                    : !availableStatuses.includes(s);
                  return (
                    <button
                      key={s}
                      type="button"
                      disabled={locked}
                      onClick={() => {
                        setValue("status", s, { shouldDirty: true });
                        if (s === "detected" || s === "resolved") {
                          setValue("timeMode", "now", {
                            shouldValidate: true,
                          });
                        }
                      }}
                      className={`flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-[12px] font-sans font-medium rounded-sf border transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 ${
                        active
                          ? "bg-sf-text text-sf-btn-text border-sf-text"
                          : "bg-sf-bg text-sf-text-sub border-sf-border hover:border-sf-text-sub hover:bg-sf-border-faint hover:text-sf-text"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                      {cfg.label}
                    </button>
                  );
                })}
              </div>
              {errors.status && (
                <p className="font-sans text-xs text-sf-red">
                  {errors.status.message}
                </p>
              )}
            </div>

            {/* Message */}
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Message</label>
              <textarea
                placeholder="What changed at this stage?"
                maxLength={MESSAGE_MAX}
                rows={3}
                {...register("message")}
                className={`${inputClass} resize-none`}
              />
              <div className="flex items-center justify-between gap-2">
                {errors.message ? (
                  <p className="font-sans text-xs text-sf-red">
                    {errors.message.message}
                  </p>
                ) : (
                  <span />
                )}
                <span className="text-xs font-sans text-sf-text-muted tabular-nums">
                  {message.length} / {MESSAGE_MAX}
                </span>
              </div>
            </div>

            {!isEdit && (
              <div className="flex flex-col gap-2">
                <label className={labelClass}>Time</label>
                <div className="flex gap-2">
                  {(["now", "custom"] as TimeMode[]).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      disabled={mode === "custom" && customTimeLocked}
                      onClick={() =>
                        setValue("timeMode", mode, {
                          shouldValidate: true,
                          shouldDirty: true,
                        })
                      }
                      className={`flex-1 py-1.5 text-[13px] font-sans font-medium rounded-sf border transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 ${
                        timeMode === mode
                          ? "bg-sf-text text-sf-btn-text border-sf-text"
                          : "bg-sf-bg text-sf-text-sub border-sf-border hover:border-sf-text-sub hover:bg-sf-border-faint hover:text-sf-text"
                      }`}
                    >
                      {mode === "now" ? "Now" : "Custom"}
                    </button>
                  ))}
                </div>
                {timeMode === "custom" ? (
                  <div className="flex flex-col gap-2">
                    <Calendar
                      mode="single"
                      selected={selectedDate ?? undefined}
                      onSelect={(date) =>
                        setValue("selectedDate", date ?? null, {
                          shouldValidate: true,
                          shouldDirty: true,
                        })
                      }
                      defaultMonth={selectedDate ?? undefined}
                      disabled={[{ before: startedAt }, { after: new Date() }]}
                      className="mx-auto"
                    />

                    <div className="flex items-center gap-2 rounded-sf border border-sf-border bg-sf-bg px-3 py-2.5">
                      <Clock className="h-3.5 w-3.5 text-sf-text-muted" />
                      <span className="mr-auto font-sans text-xs font-medium text-sf-text-sub">
                        Time
                      </span>
                      <button
                        type="button"
                        aria-label="Subtract five minutes"
                        onClick={() => adjustCustomTime(-5)}
                        disabled={!clockTimeValid}
                        className="flex h-8 w-8 items-center justify-center rounded-sf border border-sf-border bg-sf-surface text-sf-text-muted transition-colors hover:border-sf-text-sub hover:text-sf-text disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <input
                        type="text"
                        inputMode="numeric"
                        aria-label="Custom time in 24-hour format"
                        value={customClockTime}
                        maxLength={5}
                        placeholder="HH:MM"
                        onChange={(event) => {
                          const digits = event.target.value
                            .replace(/\D/g, "")
                            .slice(0, 4);
                          setClockTime(
                            digits.length > 2
                              ? `${digits.slice(0, 2)}:${digits.slice(2)}`
                              : digits,
                          );
                        }}
                        className={`h-8 w-[72px] rounded-sf border bg-sf-surface px-2 text-center font-mono text-[12px] text-sf-text outline-none transition-colors focus:ring-2 focus:ring-sf-text/10 ${
                          clockTimeValid
                            ? "border-sf-border focus:border-sf-text-sub"
                            : "border-sf-red"
                        }`}
                      />
                      <button
                        type="button"
                        aria-label="Add five minutes"
                        onClick={() => adjustCustomTime(5)}
                        disabled={!clockTimeValid}
                        className="flex h-8 w-8 items-center justify-center rounded-sf border border-sf-border bg-sf-surface text-sf-text-muted transition-colors hover:border-sf-text-sub hover:text-sf-text disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {customTimeError ? (
                      <p className="rounded-sf border border-sf-red/30 bg-sf-red-bg px-3 py-2 font-sans text-xs text-sf-red">
                        {customTimeError}
                      </p>
                    ) : selectedDate ? (
                      <div className="flex items-center gap-1.5 rounded-sf border border-sf-border bg-sf-border-faint/50 px-3 py-2 font-sans text-xs text-sf-text-muted">
                        <CalendarDays className="h-3 w-3" />
                        {selectedDate.toLocaleDateString(undefined, {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}{" "}
                        at {customClockTime}
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <p className="flex items-center gap-1.5 font-sans text-xs text-sf-text-muted">
                    <Clock className="w-3 h-3" />
                    The server will stamp this update when it is saved.
                  </p>
                )}
              </div>
            )}

            <p className="rounded-sf border border-sf-border bg-sf-border-faint/50 px-3 py-2 font-sans text-xs leading-4 text-sf-text-muted">
              Updates add commentary to the incident timeline. They do not
              change the incident lifecycle — detection and resolution are
              driven by monitor checks.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-3.5 border-t border-sf-border">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-[4px] border border-sf-border bg-sf-bg px-4 py-1.5 font-sans text-[13px] font-medium text-sf-text-sub transition-colors hover:border-sf-text-sub hover:bg-sf-border-faint hover:text-sf-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sf-text/20"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isValid}
            className="cursor-pointer rounded-[4px] bg-sf-text px-4 py-1.5 font-sans text-[13px] font-semibold text-sf-btn-text shadow-sm transition-[background-color,box-shadow,transform] duration-150 hover:-translate-y-px hover:bg-sf-btn-hover hover:shadow-md active:translate-y-0 active:bg-sf-btn-active active:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sf-text/25 focus-visible:ring-offset-2 focus-visible:ring-offset-sf-surface disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:bg-sf-text disabled:hover:shadow-sm"
          >
            {isEdit ? "Save changes" : "Save update"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default IncidentUpdateModal;
