"use client";

import { useState } from "react";
import { Clock } from "lucide-react";
import Modal from "@/components/ui/modal";
import { IncidentStatus } from "../types";

type UpdateStatus =
  | "detected"
  | "investigating"
  | "identified"
  | "monitoring"
  | "resolved";

type TimeMode = "now" | "custom";

const UPDATE_STATUS_CONFIG: Record<UpdateStatus, { label: string; dot: string }> = {
  detected: { label: "Detected", dot: "bg-sf-red" },
  investigating: { label: "Investigating", dot: "bg-sf-amber" },
  identified: { label: "Identified", dot: "bg-sf-orange" },
  monitoring: { label: "Monitoring", dot: "bg-sf-blue" },
  resolved: { label: "Resolved", dot: "bg-sf-green" },
};

const UPDATE_STATUS_ORDER: UpdateStatus[] = [
  "detected",
  "investigating",
  "identified",
  "monitoring",
  "resolved",
];

type Props = {
  open: boolean;
  onClose: () => void;
  // Pre-filled from the incident this modal is attached to.
  service: string;
  overallStatus: IncidentStatus;
};

const SUMMARY_MAX = 200;
const MESSAGE_MAX = 500;

// Styling mirrors the maintenance-window modal exactly — same input, label,
// segmented-toggle and footer button classes — so it belongs to the same
// design system.
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

const IncidentUpdateModal = ({ open, onClose, service, overallStatus }: Props) => {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [status, setStatus] = useState<UpdateStatus>("investigating");
  const [message, setMessage] = useState("");
  const [timeMode, setTimeMode] = useState<TimeMode>("now");
  const [customTime, setCustomTime] = useState("");

  const canSubmit = title.trim().length > 0 && message.trim().length > 0;

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
      description="Record what happened and the current stage of this incident."
      width="max-w-lg"
    >
      <form onSubmit={handleSubmit}>
        <div className="px-5 py-3.5 flex flex-col gap-3.5 max-h-[70vh] overflow-y-auto">
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

          {/* ── Details ── */}
          <div className="flex flex-col gap-3">
            <span className={sectionLabelClass}>Details</span>

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Title</label>
              <input
                type="text"
                placeholder="e.g. API elevated response times"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Summary</label>
              <textarea
                placeholder="One-line overview of what happened."
                value={summary}
                maxLength={SUMMARY_MAX}
                onChange={(e) => setSummary(e.target.value)}
                rows={2}
                className={`${inputClass} resize-none`}
              />
              <span className="self-end text-[11px] font-sans text-sf-text-muted tabular-nums">
                {summary.length} / {SUMMARY_MAX}
              </span>
            </div>
          </div>

          <div className="border-t border-sf-border" />

          {/* ── Timeline update ── */}
          <div className="flex flex-col gap-3">
            <span className={sectionLabelClass}>Timeline update</span>

            {/* Status — segmented pills */}
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Status</label>
              <div className="flex flex-wrap gap-2">
                {UPDATE_STATUS_ORDER.map((s) => {
                  const cfg = UPDATE_STATUS_CONFIG[s];
                  const active = status === s;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStatus(s)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-sans font-medium rounded-sf border transition-colors cursor-pointer ${
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
                rows={2}
                className={`${inputClass} resize-none`}
              />
              <span className="self-end text-[11px] font-sans text-sf-text-muted tabular-nums">
                {message.length} / {MESSAGE_MAX}
              </span>
            </div>

            {/* Time — segmented toggle + optional custom time */}
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
                <input
                  type="time"
                  value={customTime}
                  onChange={(e) => setCustomTime(e.target.value)}
                  className={`${inputClass} w-40`}
                />
              ) : (
                <p className="flex items-center gap-1.5 text-[11.5px] font-sans text-sf-text-muted">
                  <Clock className="w-3 h-3" />
                  Stamped at the current time.
                </p>
              )}
            </div>
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
