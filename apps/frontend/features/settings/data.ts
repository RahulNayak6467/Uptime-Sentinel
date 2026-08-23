import {
  Bell,
  CalendarClock,
  Globe,
  Link2,
  MapPin,
  ShieldCheck,
  SlidersHorizontal,
  User,
  Zap,
} from "lucide-react";
import type { SettingsNavGroup } from "./types";

// StatusForge is single-user, so there is no workspace / team / billing / SSO.
// The left nav is grouped the same way as the reference design, minus those.
export const settingsNav: SettingsNavGroup[] = [
  {
    heading: "General",
    items: [
      {
        id: "account",
        label: "Account",
        description: "Your profile, password, and display preferences",
        icon: User,
      },
    ],
  },
  {
    heading: "Monitoring",
    items: [
      {
        id: "monitoring-defaults",
        label: "Monitoring defaults",
        description: "Defaults applied to new monitors of each type",
        icon: SlidersHorizontal,
      },
    ],
  },
  {
    heading: "Alerting",
    items: [
      {
        id: "notifications",
        label: "Notifications",
        description: "Channels, alert rules, and delivery preferences",
        icon: Bell,
      },
      {
        id: "escalation",
        label: "Escalation",
        description: "Re-alert when an incident stays unacknowledged",
        icon: Zap,
        comingSoon: true,
      },
      {
        id: "maintenance",
        label: "Maintenance",
        description: "Planned windows that suppress alerts",
        icon: CalendarClock,
        comingSoon: true,
      },
    ],
  },
  {
    heading: "Access",
    items: [
      {
        id: "security",
        label: "Security",
        description: "Active sessions and data export",
        icon: ShieldCheck,
        comingSoon: true,
      },
      {
        id: "api-webhooks",
        label: "API & webhooks",
        description: "API keys and signed webhook delivery",
        icon: Link2,
        comingSoon: true,
      },
    ],
  },
  {
    heading: "Public",
    items: [
      {
        id: "probe-regions",
        label: "Probe regions",
        description: "Where checks run and how failures are confirmed",
        icon: MapPin,
        comingSoon: true,
      },
      {
        id: "status-page",
        label: "Status page",
        description: "Your public status page and subscribers",
        icon: Globe,
        comingSoon: true,
      },
    ],
  },
];

// --- Select options (labels are display-only; wire real values on integration) ---

// Monitoring defaults are edited per monitor type.
export const monitorTypeTabs = ["HTTP", "TCP", "TLS", "DNS"] as const;
export type MonitorTypeTab = (typeof monitorTypeTabs)[number];

// Fast lane (HTTP/TCP) vs slow lane (TLS/DNS) — different interval ranges.
export const fastIntervalOptions = [
  "30 seconds",
  "1 minute",
  "5 minutes",
  "10 minutes",
  "30 minutes",
  "1 hour",
];
export const slowIntervalOptions = ["1 hour", "3 hours", "6 hours", "12 hours", "24 hours"];

export const responseTimeThresholdOptions = ["500 ms", "1 second", "2 seconds", "5 seconds"];
export const dnsRecordTypeOptions = ["A", "AAAA", "CNAME", "MX", "TXT", "NS"];

// Default HTTP method new monitors are created with (overridable per monitor).
export const httpMethodOptions = ["GET", "POST", "PUT", "PATCH", "DELETE"];

export const requestTimeoutOptions = ["5 seconds", "10 seconds", "20 seconds", "30 seconds"];

export const retryOptions = ["1 attempt", "2 attempts", "3 attempts", "5 attempts"];

export const retryDelayOptions = ["10 seconds", "20 seconds", "30 seconds", "1 minute"];

export const dataRetentionOptions = ["3 months", "6 months", "13 months", "24 months"];

export const expiryWarningOptions = ["7 days", "14 days", "30 days", "60 days"];

export const minTlsVersionOptions = ["TLSv1.2", "TLSv1.3", "TLSv1.1", "TLSv1"];

export const timezoneOptions = [
  "(UTC-08:00) Pacific Time",
  "(UTC-05:00) Eastern Time",
  "(UTC+00:00) UTC",
  "(UTC+01:00) Central European Time",
  "(UTC+05:30) India Standard Time",
];

export const dateFormatOptions = ["Mar 4, 2026 · 14:30", "04/03/2026 · 14:30", "2026-03-04 · 14:30"];

export const themeOptions = ["Match system", "Light", "Dark"];

export const reminderCadenceOptions = ["Every 15 minutes", "Every 30 minutes", "Every hour", "Off"];

// Cap on how many reminders a single open incident sends, so a persistent email
// outage can't spam retries (backs the deferred failed-reminder-backoff work).
export const reminderCapOptions = [
  "After 3 reminders",
  "After 5 reminders",
  "After 10 reminders",
  "Never stop",
];

export const groupAlertsOptions = ["Off", "1 minute", "5 minutes", "15 minutes"];

export const quietHoursDayOptions = ["Every day", "Weekdays", "Weekends"];

export const hourOptions = Array.from(
  { length: 24 },
  (_, hour) => `${String(hour).padStart(2, "0")}:00`,
);
