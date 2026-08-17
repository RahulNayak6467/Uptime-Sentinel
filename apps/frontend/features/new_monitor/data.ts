import { Bell, Globe, Link, Mail, MapPin, Send, Server, Shield, Webhook, Wifi, Zap } from "lucide-react";
import { alertConditionsProps, monitorTypeProps, notificationChannelProps } from "./types";

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
    icon: Wifi,
    checkType: "TCP Port",
    featuresOffered: "Port reachability check",
  },
  {
    id: crypto.randomUUID(),
    icon: Server,
    checkType: "VPS",
    featuresOffered: "Server resources & agent health",
    comingSoon: true,
  },
  {
    id: crypto.randomUUID(),
    icon: MapPin,
    checkType: "DNS",
    featuresOffered: "Record resolution check",
  },
  {
    id: crypto.randomUUID(),
    icon: Shield,
    checkType: "TLS Cert",
    featuresOffered: "Cert expiry & validity",
  },
  {
    id: crypto.randomUUID(),
    icon: Webhook,
    checkType: "Webhook Events",
    featuresOffered: "Incoming events & delivery gaps",
    comingSoon: true,
  },
];

export const notificationChannels: notificationChannelProps[] = [
  { id: crypto.randomUUID(), label: "Email", icon: Mail },
  { id: crypto.randomUUID(), label: "Slack", icon: Send, comingSoon: true },
  { id: crypto.randomUUID(), label: "Webhook", icon: Link, comingSoon: true },
  { id: crypto.randomUUID(), label: "SMS", icon: Bell, comingSoon: true },
  { id: crypto.randomUUID(), label: "Discord", icon: Zap, comingSoon: true },
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
