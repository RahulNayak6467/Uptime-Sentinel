import { LucideIcon } from "lucide-react";

type ScopeVariant = "default" | "blue";

export type Recipient = {
  id: string;
  name: string;
  email: string;
  initials: string;
  isYou: boolean;
  scope: string;
  scopeVariant: ScopeVariant;
  enabled: boolean;
};

export type RecipientRowProps = {
  recipient: Recipient;
  onToggle: (id: string) => void;
};

export type AlertTypesProps = {
  icon: LucideIcon;
  alertType: string;
  alertInfo: string;
  color: string;
  enabled: boolean;
  isLast: boolean;
};

export type Channel = {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  soon?: boolean;
};

export type RenotifyOption = "15m" | "30m" | "1h" | "Off";

export type GroupOption = "Off" | "1m" | "5m" | "15m";

export type DayOption = "Every day" | "Weekdays" | "Weekends";

export type EventType = "down" | "reminder" | "recovery";

export type DeliveryStatus = "Delivered" | "Failed";

export type AlertEmail = {
  id: string;
  event: EventType;
  dot: string;
  subject: string;
  monitor: string;
  recipients: number;
  sent: string;
  delivery: DeliveryStatus;
};

export type RecentAlertItem = {
  id: string;
  type: EventType;
  urlName: string;
  status: "sent" | "failed";
  sentAt: string;
};

export type RecentAlerts = {
  data: RecentAlertItem[];
  pagination: {
    totalPage: number;
    limit: number;
    currentPage: number;
  };
};
