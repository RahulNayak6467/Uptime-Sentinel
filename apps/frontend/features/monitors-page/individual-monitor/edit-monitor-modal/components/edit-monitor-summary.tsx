import {
  BadgeCheck,
  Bell,
  Clock,
  KeyRound,
  Server,
  ShieldCheck,
} from "lucide-react";
import type { ComponentType } from "react";
import type { IndividualOverviewStatsProps } from "../../types";
import type { EditMonitorDraftState } from "../types";
import { formatCheckInterval } from "@/utils/format-check-interval";

const SummaryRow = ({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) => (
  <div className="flex items-center justify-between gap-3 border-b border-sf-border py-3 last:border-b-0">
    <div className="flex min-w-0 items-center gap-2">
      <Icon className="size-3.5 shrink-0 text-sf-text-muted" />
      <span className="truncate text-xs text-sf-text-muted">{label}</span>
    </div>
    <span className="max-w-32 truncate text-right text-xs font-semibold text-sf-text">
      {value}
    </span>
  </div>
);

export const EditMonitorSummary = ({
  monitor,
  draft,
}: {
  monitor: IndividualOverviewStatsProps;
  draft: EditMonitorDraftState;
}) => (
  <aside className="hidden border-l border-sf-border bg-sf-bg/20 xl:block">
    <div className="sticky top-0 p-4">
      <div className="rounded-md border border-sf-border bg-sf-surface">
        <div className="border-b border-sf-border px-3 py-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-sf-blue" />
            <h3 className="text-xs font-semibold text-sf-text">
              Effective config
            </h3>
          </div>
          <p className="mt-1 line-clamp-2 break-all font-mono text-[11px] leading-5 text-sf-text-muted">
            {monitor.url}
          </p>
        </div>
        <div className="px-3">
          <SummaryRow
            icon={Clock}
            label="Interval"
            value={formatCheckInterval(monitor.intervalSeconds)}
          />
          <SummaryRow
            icon={BadgeCheck}
            label="HTTP"
            value={`${draft.selectedMethod} / ${monitor.statusCodes.join(", ")}`}
          />
          <SummaryRow
            icon={KeyRound}
            label="SSL alert"
            value={draft.sslEnabled ? "14 days" : "Disabled"}
          />
          <SummaryRow
            icon={Server}
            label="DNS"
            value={draft.dnsEnabled ? draft.dnsRecord : "Disabled"}
          />
          <SummaryRow
            icon={Bell}
            label="Notify"
            value={draft.selectedNotification}
          />
        </div>
      </div>

      <div className="mt-3 rounded-md border border-sf-border bg-sf-bg/35 px-3 py-3">
        <p className="text-xs font-semibold text-sf-text">Review mode</p>
        <p className="mt-1 text-xs leading-5 text-sf-text-muted">
          Save actions are visual only until the update API contract is wired.
        </p>
      </div>
    </div>
  </aside>
);
