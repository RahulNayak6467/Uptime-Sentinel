import { Activity, Bell, CircleCheck, Link2, Mail, Send, Shield, TriangleAlert, Zap } from "lucide-react";
import { AlertEmail, Channel, DayOption, EventType, GroupOption, Recipient, RenotifyOption } from "./types";

export const initialRecipients: Recipient[] = [
  {
    id: "1",
    name: "Dana Whitman",
    email: "dana@acme.io",
    initials: "DW",
    isYou: true,
    scope: "All monitors",
    scopeVariant: "default",
    enabled: true,
  },
  {
    id: "2",
    name: "Ryan Soto",
    email: "ryan@acme.io",
    initials: "RS",
    isYou: false,
    scope: "All monitors",
    scopeVariant: "default",
    enabled: true,
  },
  {
    id: "3",
    name: "On-call",
    email: "oncall@acme.io",
    initials: "O",
    isYou: false,
    scope: "Critical only",
    scopeVariant: "blue",
    enabled: true,
  },
  {
    id: "4",
    name: "Maya Kim",
    email: "maya@acme.io",
    initials: "MK",
    isYou: false,
    scope: "Checkout, API",
    scopeVariant: "blue",
    enabled: true,
  },
  {
    id: "5",
    name: "Status Bot",
    email: "alerts@acme.pagerduty.com",
    initials: "SB",
    isYou: false,
    scope: "All monitors",
    scopeVariant: "default",
    enabled: true,
  },
];

export const channels: Channel[] = [
  { icon: Mail, label: "Email", active: true },
  { icon: Send, label: "Slack", soon: true },
  { icon: Link2, label: "Webhook", soon: true },
  { icon: Bell, label: "SMS", soon: true },
  { icon: Zap, label: "Discord", soon: true },
];

export const renotifyOptions: RenotifyOption[] = ["15m", "30m", "1h", "Off"];

export const groupOptions: GroupOption[] = ["Off", "1m", "5m", "15m"];

export const hours: string[] = Array.from({ length: 24 }, (_, i) =>
  i.toString().padStart(2, "0") + ":00"
);

export const dayOptions: DayOption[] = ["Every day", "Weekdays", "Weekends"];

export const alertEmails: AlertEmail[] = [
  {
    id: "1",
    event: "Down",
    dot: "bg-sf-red",
    subject: "Checkout Service is DOWN (HTTP 503)",
    monitor: "Checkout Service",
    recipients: 4,
    sent: "12m ago",
    delivery: "Delivered",
  },
  {
    id: "2",
    event: "Degraded",
    dot: "bg-sf-amber",
    subject: "Search API degraded — p95 412ms",
    monitor: "Search API",
    recipients: 4,
    sent: "2h ago",
    delivery: "Delivered",
  },
  {
    id: "3",
    event: "Recovery",
    dot: "bg-sf-green",
    subject: "Auth Service recovered",
    monitor: "Auth Service",
    recipients: 4,
    sent: "1d ago",
    delivery: "Delivered",
  },
  {
    id: "4",
    event: "Down",
    dot: "bg-sf-red",
    subject: "Email Service is DOWN",
    monitor: "Email Service",
    recipients: 2,
    sent: "2d ago",
    delivery: "Delivered",
  },
  {
    id: "5",
    event: "Recovery",
    dot: "bg-sf-green",
    subject: "Status Page DNS recovered",
    monitor: "Status Page DNS",
    recipients: 4,
    sent: "3d ago",
    delivery: "Delivered",
  },
  {
    id: "6",
    event: "Down",
    dot: "bg-sf-red",
    subject: "CDN Images is DOWN",
    monitor: "CDN Images",
    recipients: 4,
    sent: "5d ago",
    delivery: "Failed",
  },
];

export const eventBadgeClass: Record<EventType, string> = {
  Down: "text-sf-red border-sf-red/30 bg-sf-red-bg",
  Degraded: "text-sf-amber border-sf-amber/30 bg-amber-50 dark:bg-amber-950/20",
  Recovery: "text-sf-green border-sf-green/30 bg-sf-green-bg",
};

export const alertTypes = [
  {
    id: crypto.randomUUID(),
    icon: TriangleAlert,
    color: "red",
    eventType: "Monitor goes down",
    description: "Send the moment a monitor crosses its failure threshold",
    enabled: true,
    isLast: false,
  },
  {
    id: crypto.randomUUID(),
    icon: CircleCheck,
    color: "green",
    eventType: "Monitor recovers",
    description: "Send when a monitor returns to a healthy state",
    enabled: true,
    isLast: false,
  },
  {
    id: crypto.randomUUID(),
    icon: Activity,
    color: "amber",
    eventType: "Degraded performance",
    description: "Send when response time exceeds the configured threshold",
    enabled: true,
    isLast: false,
  },
  {
    id: crypto.randomUUID(),
    icon: Shield,
    color: "blue",
    eventType: "SSL certificate expiring",
    description: "Warn 14, 7 and 1 day before a certificate expires",
    enabled: true,
    isLast: true,
  },
];
