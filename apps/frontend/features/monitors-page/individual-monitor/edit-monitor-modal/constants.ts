import {
  Activity,
  Bell,
  Code2,
  Globe2,
  Link,
  LockKeyhole,
  Mail,
  MapPin,
  Send,
  Shield,
  SlidersHorizontal,
  Smartphone,
  TimerReset,
  Wifi,
  Zap,
} from "lucide-react";
import type { EditMonitorTab } from "./types";

export const editMonitorTabs: EditMonitorTab[] = [
  { key: "general", label: "General", icon: SlidersHorizontal },
  { key: "http", label: "HTTP rules", icon: Code2 },
  { key: "thresholds", label: "Thresholds", icon: TimerReset },
  { key: "ssl", label: "SSL", icon: LockKeyhole },
  { key: "dns", label: "DNS", icon: Globe2 },
  { key: "notifications", label: "Notifications", icon: Bell },
];

export const formInputClass =
  "h-10 w-full rounded-md border border-sf-border bg-sf-bg/45 px-3 text-[13px] text-sf-text outline-none transition-colors placeholder:text-sf-text-muted focus:border-sf-text-sub focus:bg-sf-surface focus:shadow-sf-focus";

export const secondaryButtonClass =
  "flex h-9 cursor-pointer items-center justify-center gap-2 rounded-[4px] border border-sf-border bg-sf-surface px-4 text-xs font-semibold text-sf-text transition-colors hover:bg-sf-bg";

export const editMonitorIntervals = [
  { label: "30s", value: "30" },
  { label: "1m", value: "60" },
  { label: "2m", value: "120" },
  { label: "5m", value: "300" },
  { label: "10m", value: "600" },
  { label: "30m", value: "1800" },
  { label: "1h", value: "3600" },
];

export const editMonitorMethods = ["GET", "POST", "PUT", "PATCH", "DELETE"];

export const requestBodyTypes = [
  { id: "none", label: "None", contentType: "" },
  { id: "json", label: "JSON", contentType: "application/json" },
  {
    id: "form-encoded",
    label: "Form-encoded",
    contentType: "application/x-www-form-urlencoded",
  },
  { id: "raw-text", label: "Raw text", contentType: "text/plain" },
];

export const bodyMethods = ["POST", "PUT", "PATCH", "DELETE"];

export const monitoringRegions = [
  "US East",
  "US West",
  "EU West",
  "EU Central",
  "Asia Pacific",
  "S. America",
  "Australia",
  "Middle East",
];

export const checkFamilies = [
  {
    label: "HTTP/HTTPS",
    description: "URL availability and response rules",
    icon: Globe2,
    state: "Locked",
  },
  {
    label: "Keyword",
    description: "Response content match",
    icon: Code2,
    state: "HTTP rule",
  },
  {
    label: "SSL Cert",
    description: "Certificate expiry and validity",
    icon: Shield,
    state: "V7",
  },
  {
    label: "DNS",
    description: "Record resolution and change detection",
    icon: MapPin,
    state: "V7",
  },
  {
    label: "TCP Port",
    description: "Port reachability check",
    icon: Wifi,
    state: "Planned",
  },
  {
    label: "Ping",
    description: "ICMP host reachability",
    icon: Activity,
    state: "Planned",
  },
];

export const notificationChannels = [
  { label: "Email", icon: Mail },
  { label: "Slack", icon: Send, comingSoon: true },
  { label: "Webhook", icon: Link, comingSoon: true },
  { label: "SMS", icon: Smartphone, comingSoon: true },
  { label: "Discord", icon: Zap, comingSoon: true },
];
