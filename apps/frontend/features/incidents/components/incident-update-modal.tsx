"use client";

import { useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  Minus,
  Plus,
} from "lucide-react";
import Modal from "@/components/ui/modal";
import { IncidentStatus } from "../types";

type UpdateStatus = "investigating" | "monitoring";

type TimeMode = "now" | "custom";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

const isSameDay = (first: Date, second: Date) =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate();

const isValidClockTime = (value: string) => {
  const match = /^(\d{2}):(\d{2})$/.exec(value);
  if (!match) return false;

  const hour = Number(match[1]);
  const minute = Number(match[2]);
  return hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59;
};

const UPDATE_STATUS_CONFIG: Record<
  UpdateStatus,
  { label: string; dot: string }
> = {
  investigating: { label: "Investigating", dot: "bg-sf-amber" },
  monitoring: { label: "Monitoring", dot: "bg-sf-blue" },
};

const UPDATE_STATUS_ORDER: UpdateStatus[] = [
  "investigating",
  "monitoring",
];

type Props = {
  open: boolean;
  onClose: () => void;
  service: string;
  overallStatus: IncidentStatus;
};

const MESSAGE_MAX = 500;

const inputClass =
  "w-full px-3 py-2 text-[13px] font-sans bg-sf-bg border border-sf-border rounded-sf text-sf-text placeholder:text-sf-text-muted focus:outline-none focus:ring-2 focus:ring-sf-text/10 focus:border-sf-text-sub transition-colors";

const labelClass =
  "text-[12px] font-semibold font-sans text-sf-text-sub uppercase tracking-wide";

const sectionLabelClass =
  "text-[11px] font-semibold font-sans text-sf-text-muted uppercase tracking-[0.06em]";

const overallBadge: Record<IncidentStatus, string> = {
  active: "bg-sf-red-bg text-sf-red border border-sf-red/30",
  resolved: "bg-sf-green-bg text-sf-green border border-sf-green/30",
};

const IncidentUpdateModal = ({
  open,
  onClose,
  service,
  overallStatus,
}: Props) => {
  const [status, setStatus] = useState<UpdateStatus>("investigating");
  const [message, setMessage] = useState("");
  const [timeMode, setTimeMode] = useState<TimeMode>("now");
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [visibleMonth, setVisibleMonth] = useState(
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );
  const [customClockTime, setCustomClockTime] = useState(() => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  });

  const firstWeekday = visibleMonth.getDay();
  const daysInMonth = new Date(
    visibleMonth.getFullYear(),
    visibleMonth.getMonth() + 1,
    0,
  ).getDate();
  const calendarCells = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];

  const canSubmit =
    message.trim().length > 0 &&
    (timeMode === "now" ||
      (selectedDate !== null && isValidClockTime(customClockTime)));

  const adjustCustomTime = (minutesToAdd: number) => {
    if (!isValidClockTime(customClockTime)) return;

    const [hour, minute] = customClockTime.split(":").map(Number);
    const totalMinutes = (hour * 60 + minute + minutesToAdd + 1440) % 1440;
    const nextHour = Math.floor(totalMinutes / 60);
    const nextMinute = totalMinutes % 60;
    setCustomClockTime(
      `${nextHour.toString().padStart(2, "0")}:${nextMinute
        .toString()
        .padStart(2, "0")}`,
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Log incident update"
      description="Add an investigating or monitoring note to the incident timeline."
      width="max-w-md"
    >
      <form onSubmit={handleSubmit}>
        <div className="flex max-h-[70vh] flex-col gap-3 overflow-y-auto px-5 py-4">
          {/* Context banner — which incident this belongs to (read-only) */}
          <div className="flex items-center gap-2.5 rounded-sf border border-sf-border bg-sf-border-faint/50 px-3 py-2">
            <span className="text-[11px] font-semibold font-sans text-sf-text-muted uppercase tracking-wide">
              Incident
            </span>
            <span className="text-[13px] font-sans font-medium text-sf-text">
              {service}
            </span>
            <span
              className={`ml-auto text-[10px] font-semibold font-sans px-2 py-0.5 rounded-full ${overallBadge[overallStatus]}`}
            >
              {overallStatus === "active" ? "Active" : "Resolved"}
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            <span className={sectionLabelClass}>Timeline update</span>

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Status</label>
              <div className="grid grid-cols-2 gap-2">
                {UPDATE_STATUS_ORDER.map((s) => {
                  const cfg = UPDATE_STATUS_CONFIG[s];
                  const active = status === s;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStatus(s)}
                      className={`flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-[12px] font-sans font-medium rounded-sf border transition-colors cursor-pointer ${
                        active
                          ? "bg-sf-text text-sf-btn-text border-sf-text"
                          : "bg-sf-bg text-sf-text-sub border-sf-border hover:border-sf-text-sub"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                      {cfg.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Message */}
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Message</label>
              <textarea
                placeholder="What changed at this stage?"
                value={message}
                maxLength={MESSAGE_MAX}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={3}
                className={`${inputClass} resize-none`}
              />
              <span className="self-end text-[11px] font-sans text-sf-text-muted tabular-nums">
                {message.length} / {MESSAGE_MAX}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <label className={labelClass}>Time</label>
              <div className="flex gap-2">
                {(["now", "custom"] as TimeMode[]).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setTimeMode(mode)}
                    className={`flex-1 py-1.5 text-[13px] font-sans font-medium rounded-sf border transition-colors cursor-pointer ${
                      timeMode === mode
                        ? "bg-sf-text text-sf-btn-text border-sf-text"
                        : "bg-sf-bg text-sf-text-sub border-sf-border hover:border-sf-text-sub"
                    }`}
                  >
                    {mode === "now" ? "Now" : "Custom"}
                  </button>
                ))}
              </div>
              {timeMode === "custom" ? (
                <div className="overflow-hidden rounded-sf border border-sf-border bg-sf-bg">
                  <div className="flex items-center justify-between border-b border-sf-border px-3 py-2.5">
                    <button
                      type="button"
                      aria-label="Previous month"
                      onClick={() =>
                        setVisibleMonth(
                          new Date(
                            visibleMonth.getFullYear(),
                            visibleMonth.getMonth() - 1,
                            1,
                          ),
                        )
                      }
                      className="rounded-sf p-1 text-sf-text-muted transition-colors hover:bg-sf-border-faint hover:text-sf-text"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="font-sans text-[12px] font-semibold text-sf-text">
                      {visibleMonth.toLocaleDateString(undefined, {
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    <button
                      type="button"
                      aria-label="Next month"
                      onClick={() =>
                        setVisibleMonth(
                          new Date(
                            visibleMonth.getFullYear(),
                            visibleMonth.getMonth() + 1,
                            1,
                          ),
                        )
                      }
                      className="rounded-sf p-1 text-sf-text-muted transition-colors hover:bg-sf-border-faint hover:text-sf-text"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="p-3">
                    <div className="grid grid-cols-7 gap-1">
                      {WEEKDAYS.map((weekday, index) => (
                        <span
                          key={`${weekday}-${index}`}
                          className="flex h-6 items-center justify-center font-sans text-[10px] font-semibold text-sf-text-muted"
                        >
                          {weekday}
                        </span>
                      ))}
                      {calendarCells.map((day, index) => {
                        if (day === null) {
                          return <span key={`empty-${index}`} className="h-8" />;
                        }

                        const date = new Date(
                          visibleMonth.getFullYear(),
                          visibleMonth.getMonth(),
                          day,
                        );
                        const selected = selectedDate
                          ? isSameDay(date, selectedDate)
                          : false;

                        return (
                          <button
                            key={day}
                            type="button"
                            aria-label={date.toLocaleDateString()}
                            aria-pressed={selected}
                            onClick={() => setSelectedDate(date)}
                            className={`flex h-8 items-center justify-center rounded-sf font-sans text-[11px] font-medium transition-colors ${
                              selected
                                ? "bg-sf-text text-sf-btn-text"
                                : "text-sf-text-sub hover:bg-sf-border-faint hover:text-sf-text"
                            }`}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 border-t border-sf-border px-3 py-2.5">
                    <Clock className="h-3.5 w-3.5 text-sf-text-muted" />
                    <span className="mr-auto font-sans text-[11px] font-medium text-sf-text-sub">
                      Time
                    </span>
                    <button
                      type="button"
                      aria-label="Subtract five minutes"
                      onClick={() => adjustCustomTime(-5)}
                      disabled={!isValidClockTime(customClockTime)}
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
                        setCustomClockTime(
                          digits.length > 2
                            ? `${digits.slice(0, 2)}:${digits.slice(2)}`
                            : digits,
                        );
                      }}
                      className={`h-8 w-[72px] rounded-sf border bg-sf-surface px-2 text-center font-mono text-[12px] text-sf-text outline-none transition-colors focus:ring-2 focus:ring-sf-text/10 ${
                        isValidClockTime(customClockTime)
                          ? "border-sf-border focus:border-sf-text-sub"
                          : "border-sf-red"
                      }`}
                    />
                    <button
                      type="button"
                      aria-label="Add five minutes"
                      onClick={() => adjustCustomTime(5)}
                      disabled={!isValidClockTime(customClockTime)}
                      className="flex h-8 w-8 items-center justify-center rounded-sf border border-sf-border bg-sf-surface text-sf-text-muted transition-colors hover:border-sf-text-sub hover:text-sf-text disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {selectedDate && isValidClockTime(customClockTime) ? (
                    <div className="flex items-center gap-1.5 border-t border-sf-border bg-sf-border-faint/50 px-3 py-2 font-sans text-[10.5px] text-sf-text-muted">
                      <CalendarDays className="h-3 w-3" />
                      {selectedDate.toLocaleDateString(undefined, {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })} at {customClockTime}
                    </div>
                  ) : (
                    <p className="border-t border-sf-border bg-sf-red-bg px-3 py-2 font-sans text-[10.5px] text-sf-red">
                      Enter a valid time between 00:00 and 23:59.
                    </p>
                  )}
                </div>
              ) : (
                <p className="flex items-center gap-1.5 text-[11.5px] font-sans text-sf-text-muted">
                  <Clock className="w-3 h-3" />
                  The server will stamp this update when it is saved.
                </p>
              )}
            </div>

            <p className="rounded-sf border border-sf-border bg-sf-border-faint/50 px-3 py-2 font-sans text-[11px] leading-4 text-sf-text-muted">
              Detected and Resolved events are added automatically by monitor
              checks. This update adds commentary only and does not change the
              incident lifecycle.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-3.5 border-t border-sf-border">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-[13px] font-sans font-medium text-sf-text-sub bg-sf-bg border border-sf-border rounded-sf hover:bg-sf-border-faint hover:text-sf-text transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!canSubmit}
            className="px-4 py-1.5 text-[13px] font-sans font-semibold text-sf-btn-text bg-sf-text rounded-sf hover:bg-sf-btn-hover active:bg-sf-btn-active transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-sf-text"
          >
            Save update
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default IncidentUpdateModal;
