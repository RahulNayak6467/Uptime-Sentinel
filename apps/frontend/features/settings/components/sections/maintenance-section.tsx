"use client";

import { CalendarClock, Pencil, Plus, SlidersHorizontal, Trash2 } from "lucide-react";
import {
  Pill,
  PrimaryButton,
  SelectInput,
  SettingCard,
  SettingRow,
  Toggle,
} from "../form-controls";

const windows = [
  { name: "Database migration", schedule: "Jun 22 · 02:00–04:00 · Postgres", status: "Scheduled", tone: "blue" as const },
  { name: "Weekly cache warm", schedule: "Sundays · 03:00–03:30 · CDN", status: "Recurring", tone: "amber" as const },
  { name: "Certificate rotation", schedule: "May 28 · 03:00–03:30 · Auth API", status: "Completed", tone: "neutral" as const },
];

const advanceNoticeOptions = ["1 hour", "6 hours", "12 hours", "24 hours"];

const MaintenanceSection = () => (
  <div className="space-y-4">
    <SettingCard
      icon={CalendarClock}
      title="Maintenance windows"
      description="Suppress alerts and show a banner during planned work"
      footer={
        <PrimaryButton>
          <span className="inline-flex items-center gap-1.5">
            <Plus className="size-3.5" />
            Schedule maintenance
          </span>
        </PrimaryButton>
      }
    >
      <div className="overflow-hidden rounded-md border border-sf-border bg-sf-bg/10 px-3">
        {windows.map((window) => (
          <div
            key={window.name}
            className="flex items-center justify-between gap-4 border-b border-sf-border-faint py-3 last:border-b-0"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-[13px] font-semibold text-sf-text">{window.name}</p>
                <Pill tone={window.tone}>{window.status}</Pill>
              </div>
              <p className="mt-1 text-xs text-sf-text-muted">{window.schedule}</p>
            </div>
            <div className="flex shrink-0 items-center gap-3 text-sf-text-muted">
              <Pencil className="size-3.5 cursor-pointer hover:text-sf-text" />
              <Trash2 className="size-3.5 cursor-pointer hover:text-sf-red" />
            </div>
          </div>
        ))}
      </div>
    </SettingCard>

    <SettingCard
      icon={SlidersHorizontal}
      title="Maintenance defaults"
      description="Applied to every new window"
      footer={<PrimaryButton>Save defaults</PrimaryButton>}
    >
      <SettingRow
        label="Suppress alerts during the window"
        description="Failures are recorded but no notification is sent"
      >
        <Toggle defaultChecked />
      </SettingRow>
      <SettingRow
        label="Exclude from uptime calculations"
        description="Downtime inside a window does not count against uptime"
      >
        <Toggle defaultChecked />
      </SettingRow>
      <SettingRow
        label="Advance notice"
        description="How long before the window subscribers are notified"
      >
        <SelectInput fullWidth={false} defaultValue="24 hours">
          {advanceNoticeOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </SelectInput>
      </SettingRow>
    </SettingCard>
  </div>
);

export default MaintenanceSection;
