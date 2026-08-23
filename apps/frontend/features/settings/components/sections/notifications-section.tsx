"use client";

import { useState } from "react";
import RecentAlerts from "@/features/integrations/email-alerts/components/recent-alerts/recent-alerts";
import {
  Bell,
  Clock,
  Link2,
  Mail,
  MessagesSquare,
  MessageSquare,
  Send,
  Smartphone,
  type LucideIcon,
} from "lucide-react";
import {
  groupAlertsOptions,
  hourOptions,
  monitorTypeTabs,
  quietHoursDayOptions,
  reminderCadenceOptions,
  reminderCapOptions,
  type MonitorTypeTab,
} from "../../data";
import {
  Field,
  GhostButton,
  SegmentedControl,
  SelectInput,
  SettingCard,
  SettingRow,
  Toggle,
} from "../form-controls";

const SelectField = ({
  label,
  hint,
  options,
  defaultValue,
}: {
  label: string;
  hint?: string;
  options: string[];
  defaultValue: string;
}) => (
  <Field label={label} hint={hint}>
    <SelectInput defaultValue={defaultValue}>
      {options.map((option) => (
        <option key={option}>{option}</option>
      ))}
    </SelectInput>
  </Field>
);

type Channel = {
  icon: LucideIcon;
  name: string;
  meta: string;
  active?: boolean;
  comingSoon?: boolean;
};

// Channels on the StatusForge roadmap. Only Email ships in V7; the rest are
// wired in later versions (Slack/Webhook/SMS/Discord).
const channels: Channel[] = [
  { icon: Mail, name: "Email", meta: "rahul@statusforge.io", active: true },
  { icon: MessageSquare, name: "Slack", meta: "Coming soon", comingSoon: true },
  { icon: Link2, name: "Webhook", meta: "Coming soon", comingSoon: true },
  { icon: Smartphone, name: "SMS", meta: "Coming soon", comingSoon: true },
  { icon: MessagesSquare, name: "Discord", meta: "Coming soon", comingSoon: true },
];

type AlertRule = { label: string; description: string; on: boolean };

// Alert rules per monitor type — mirrors the per-type alert catalogs in the
// individual-monitor design files (tcp/dns/certificates-monitor). Rules that map
// to opt-in features (address/record pinning, fingerprint pin, email auth) are
// off by default.
const alertRulesByType: Record<MonitorTypeTab, AlertRule[]> = {
  HTTP: [
    { label: "Monitor goes down", description: "The request errors or the connection fails", on: true },
    { label: "Response time degraded", description: "Response time breaches the configured threshold", on: true },
    { label: "Unexpected status code", description: "The response code is outside the expected set", on: true },
    { label: "Recovery", description: "Checks pass again after an incident", on: true },
  ],
  TCP: [
    { label: "Connection failure", description: "The port stops accepting TCP connections", on: true },
    { label: "Slow connection", description: "Connection time reaches the slow threshold", on: true },
    { label: "Socket error", description: "A timeout, reset, or unreachable-host error is recorded", on: true },
    { label: "Banner mismatch", description: "The service banner no longer matches the expected pattern", on: true },
    { label: "Address changed", description: "The hostname resolves to a different IP address", on: false },
    { label: "Recovery", description: "The port accepts connections again after a failure", on: true },
  ],
  TLS: [
    { label: "Monitor goes down", description: "The host is unreachable or the handshake fails", on: true },
    { label: "Certificate expiring", description: "Remaining days reach the warning threshold", on: true },
    { label: "Expired or invalid", description: "Expiry, trust, or certificate-chain validation fails", on: true },
    { label: "Hostname mismatch", description: "Certificate identity no longer matches the hostname", on: true },
    { label: "Certificate renewal", description: "Fingerprint or serial number changes", on: true },
    { label: "Revocation detected", description: "OCSP or CRL reports the certificate as revoked", on: true },
    { label: "Weak TLS configuration", description: "A deprecated protocol or weak cipher becomes reachable", on: true },
    { label: "Fingerprint pin broken", description: "The live certificate no longer matches the pinned fingerprint", on: false },
    { label: "Recovery", description: "Certificate becomes valid again after a failure", on: true },
  ],
  DNS: [
    { label: "Resolution failure", description: "The hostname no longer returns a successful DNS response", on: true },
    { label: "Record changed", description: "A monitored record is added, removed, or modified", on: true },
    { label: "Nameserver failure", description: "An authoritative nameserver stops responding", on: true },
    { label: "Resolver inconsistency", description: "Public resolvers return different answers", on: true },
    { label: "Record left allowlist", description: "A pinned record resolves to an unexpected value", on: false },
    { label: "Email auth broken", description: "SPF, DMARC, or MTA-STS stops validating", on: false },
    { label: "Recovery", description: "Resolution succeeds again after a failure", on: true },
  ],
};

const ChannelBadge = ({ active }: { active: boolean }) =>
  active ? (
    <span className="rounded-sf border border-sf-green-border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-sf-green">
      Active
    </span>
  ) : (
    <span className="rounded-sf bg-sf-bg px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-sf-text-muted">
      Soon
    </span>
  );

const ChannelCard = ({ icon: Icon, name, meta, active = false, comingSoon = false }: Channel) => (
  <div className="flex items-center justify-between gap-3 rounded-md border border-sf-border bg-sf-bg/15 px-3 py-2.5">
    <div className="flex min-w-0 items-center gap-3">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-md border border-sf-border bg-sf-bg/20 text-sf-text-muted">
        <Icon className="size-4" strokeWidth={1.75} aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-[13px] font-semibold text-sf-text">{name}</p>
          <ChannelBadge active={active} />
        </div>
        <p className="truncate text-xs text-sf-text-muted">{meta}</p>
      </div>
    </div>
    <Toggle defaultChecked={active} disabled={comingSoon} />
  </div>
);

const NotificationsSection = () => {
  const [alertType, setAlertType] = useState<MonitorTypeTab>("HTTP");

  return (
    <div className="space-y-4">
      <SettingCard
        icon={Send}
        title="Delivery channels"
        description="Where alerts are sent"
        footer={<GhostButton>Send test alert</GhostButton>}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {channels.map((channel) => (
            <ChannelCard key={channel.name} {...channel} />
          ))}
        </div>
      </SettingCard>

      <SettingCard
        icon={Bell}
        title="Alert rules"
        description="Which events generate a notification, per monitor type"
      >
        <div className="mb-4">
          <SegmentedControl options={monitorTypeTabs} value={alertType} onChange={setAlertType} />
        </div>
        {alertRulesByType[alertType].map((rule) => (
          <SettingRow key={rule.label} label={rule.label} description={rule.description}>
            <Toggle defaultChecked={rule.on} />
          </SettingRow>
        ))}
      </SettingCard>

      <SettingCard
        icon={Clock}
        title="Delivery preferences"
        description="How and when notifications are sent"
      >
        <div className="mb-2 grid gap-4 sm:grid-cols-2">
          <SelectField
            label="Reminder cadence"
            hint="while an incident stays open"
            options={reminderCadenceOptions}
            defaultValue="Every 30 minutes"
          />
          <SelectField
            label="Stop reminders"
            hint="cap re-alerts per incident"
            options={reminderCapOptions}
            defaultValue="After 5 reminders"
          />
          <SelectField
            label="Group related alerts"
            hint="bundle alerts within a window"
            options={groupAlertsOptions}
            defaultValue="5 minutes"
          />
        </div>
        <SettingRow label="Daily digest" description="A once-daily summary email of all events">
          <Toggle />
        </SettingRow>
        <SettingRow
          label="Quiet hours"
          description="Hold non-critical alerts during the window · critical alerts always deliver"
        >
          <Toggle />
        </SettingRow>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <SelectField label="Active days" options={quietHoursDayOptions} defaultValue="Every day" />
          <SelectField label="From" options={hourOptions} defaultValue="22:00" />
          <SelectField label="To" options={hourOptions} defaultValue="07:00" />
        </div>
      </SettingCard>

      <div>
        <h3 className="text-sm font-semibold text-sf-text">Recent alert deliveries</h3>
        <p className="mt-0.5 text-xs text-sf-text-muted">Alert emails sent over the last 7 days</p>
        <RecentAlerts />
      </div>
    </div>
  );
};

export default NotificationsSection;
