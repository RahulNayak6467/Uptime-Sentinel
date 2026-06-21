"use client";

import { useState } from "react";
import Modal from "@/components/ui/modal";

type RepeatOption = "once" | "daily" | "weekly";

const REPEAT_OPTIONS: { value: RepeatOption; label: string }[] = [
  { value: "once", label: "Once" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
];

const MOCK_MONITORS = [
  "Checkout Service",
  "Auth API",
  "Search API",
  "CDN Images",
  "Email Service",
  "Status Page DNS",
];

type Props = {
  open: boolean;
  onClose: () => void;
};

const MaintenanceWindowModal = ({ open, onClose }: Props) => {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [repeat, setRepeat] = useState<RepeatOption>("once");
  const [selectedMonitors, setSelectedMonitors] = useState<string[]>([]);

  const toggleMonitor = (monitor: string) => {
    setSelectedMonitors((prev) =>
      prev.includes(monitor)
        ? prev.filter((m) => m !== monitor)
        : [...prev, monitor],
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
  };

  const inputClass =
    "w-full px-3 py-2 text-[13px] font-sans bg-sf-bg border border-sf-border rounded-sf text-sf-text placeholder:text-sf-text-muted focus:outline-none focus:ring-2 focus:ring-sf-text/10 focus:border-sf-text-sub transition-colors";

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="New maintenance window"
      description="Suppress alerts for the selected monitors during this period."
      width="max-w-lg"
    >
      <form onSubmit={handleSubmit}>
        <div className="px-5 py-4 flex flex-col gap-4">
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold font-sans text-sf-text-sub uppercase tracking-wide">
              Name
            </label>
            <input
              type="text"
              placeholder="e.g. Scheduled DB maintenance"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={inputClass}
            />
          </div>

          {/* Start */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold font-sans text-sf-text-sub uppercase tracking-wide">
              Start
            </label>
            <div className="flex gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className={inputClass}
              />
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                className={`${inputClass} w-32 shrink-0`}
              />
            </div>
          </div>

          {/* End */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold font-sans text-sf-text-sub uppercase tracking-wide">
              End
            </label>
            <div className="flex gap-2">
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                className={inputClass}
              />
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
                className={`${inputClass} w-32 shrink-0`}
              />
            </div>
          </div>

          {/* Repeat */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold font-sans text-sf-text-sub uppercase tracking-wide">
              Repeat
            </label>
            <div className="flex gap-2">
              {REPEAT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setRepeat(opt.value)}
                  className={`flex-1 py-1.5 text-[13px] font-sans font-medium rounded-sf border transition-colors cursor-pointer ${
                    repeat === opt.value
                      ? "bg-sf-text text-sf-btn-text border-sf-text"
                      : "bg-sf-bg text-sf-text-sub border-sf-border hover:border-sf-text-sub"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Monitors */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold font-sans text-sf-text-sub uppercase tracking-wide">
              Affected monitors
            </label>
            <div className="border border-sf-border rounded-sf bg-sf-bg divide-y divide-sf-border max-h-40 overflow-y-auto">
              {MOCK_MONITORS.map((monitor) => {
                const checked = selectedMonitors.includes(monitor);
                return (
                  <label
                    key={monitor}
                    className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-sf-border-faint/60 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleMonitor(monitor)}
                      className="w-3.5 h-3.5 accent-sf-text cursor-pointer"
                    />
                    <span className="text-[13px] font-sans text-sf-text">
                      {monitor}
                    </span>
                  </label>
                );
              })}
            </div>
            {selectedMonitors.length === 0 && (
              <p className="text-[11.5px] font-sans text-sf-text-muted">
                No monitors selected — alerts will still fire.
              </p>
            )}
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
            className="px-4 py-1.5 text-[13px] font-sans font-semibold text-sf-btn-text bg-sf-text rounded-sf hover:bg-sf-btn-hover active:bg-sf-btn-active transition-colors cursor-pointer"
          >
            Create window
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default MaintenanceWindowModal;
