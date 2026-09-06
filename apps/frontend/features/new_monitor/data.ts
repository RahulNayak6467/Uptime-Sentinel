import { Globe, Mail, Shield } from "lucide-react";
// Bell, Link, Send, Server, Zap — icons for parked out-of-scope items (VPS
// monitor type + Slack/Webhook/SMS/Discord channels). Restore when re-enabling.
import { alertConditionsProps, monitorTypeProps, notificationChannelProps } from "./types";
import { tlsMonitorProps } from "./schemas/monitor-info";

type TlsAlertEvent = tlsMonitorProps["enabledAlerts"][number];

// TLS certificate alert events (map to tls_config.enabled_alerts). All enabled
// by default; users can narrow them on the TLS create form.
export const tlsAlertEvents: { id: TlsAlertEvent; label: string; description: string }[] = [
  { id: "expiring", label: "Expiring soon", description: "Certificate nears its expiry window" },
  { id: "expired_or_invalid", label: "Expired or invalid", description: "Certificate is expired or fails validation" },
  { id: "hostname_mismatch", label: "Hostname mismatch", description: "Certificate does not cover the monitored host" },
  { id: "renewal", label: "Renewed", description: "A new certificate was detected" },
  { id: "revocation", label: "Revoked", description: "Certificate reported as revoked" },
  { id: "weak_config", label: "Weak configuration", description: "Weak protocol, cipher, or key detected" },
  { id: "recovery", label: "Recovered", description: "Certificate is healthy again after an alert" },
];

export const defaultTlsAlertEvents: tlsMonitorProps["enabledAlerts"] =
  tlsAlertEvents.map((event) => event.id);

export const httpMethods = ["get", "post", "put", "patch", "delete"];

export const bodyTypes = [
  { id: "none", label: "None", contentType: "none" },
  { id: "json", label: "JSON", contentType: "application/json" },
  { id: "form-encoded", label: "Form-encoded", contentType: "application/x-www-form-urlencoded" },
  { id: "raw-text", label: "Raw text", contentType: "text/plain" },
] as const;

export const checkIntervals = ["30s", "1m", "2m", "5m", "10m", "30m", "1h"];

// Slow-lane intervals for TLS/DNS (hours-scale). Default 12h, floor 1h.
export const tlsCheckIntervals = ["1h", "3h", "6h", "12h", "24h"];

export type checkIntervalsTypeProps = "30s" | "1m" | "2m" | "5m" | "10m" | "30m" | "1h"

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

type monitorTypesDataProps = { id: string } & monitorTypeProps;

export const monitorTypesData: monitorTypesDataProps[] = [
  {
    id: crypto.randomUUID(),
    icon: Globe,
    checkType: "HTTP/HTTPS",
    featuresOffered: "URL availability & response codes",
  },
  {
    id: crypto.randomUUID(),
    icon: Shield,
    checkType: "TLS Cert",
    featuresOffered: "Cert expiry & validity",
  },
  // VPS monitoring is out of current scope — parked, not deleted.
  // {
  //   id: crypto.randomUUID(),
  //   icon: Server,
  //   checkType: "VPS",
  //   featuresOffered: "Host resources & agent health",
  //   comingSoon: true,
  // },
];

export const notificationChannels: notificationChannelProps[] = [
  { id: crypto.randomUUID(), label: "Email", icon: Mail },
  // Slack / Webhook / SMS / Discord are V13 (Integrations) — out of current
  // scope, parked not deleted. Re-enable with the icons in the import above.
  // { id: crypto.randomUUID(), label: "Slack", icon: Send, comingSoon: true },
  // { id: crypto.randomUUID(), label: "Webhook", icon: Link, comingSoon: true },
  // { id: crypto.randomUUID(), label: "SMS", icon: Bell, comingSoon: true },
  // { id: crypto.randomUUID(), label: "Discord", icon: Zap, comingSoon: true },
];

type alertConditionsDataProps = { id: string } & alertConditionsProps;

export const alertConditionsData: alertConditionsDataProps[] = [
  {
    id: crypto.randomUUID(),
    alertType: "Alert after consecutive failures",
    alertText: "Trigger an incident after N checks fail in a row",
    alertMessage: "failures",
  },
  {
    id: crypto.randomUUID(),
    alertType: "Recover after consecutive successes",
    alertText: "Auto-resolve incident once checks pass again",
    alertMessage: "success",
  },
];
