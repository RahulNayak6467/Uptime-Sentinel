import type { ComponentType } from "react";

export type EditMonitorTabKey =
  | "general"
  | "http"
  | "thresholds"
  | "ssl"
  | "dns"
  | "notifications";

export type EditMonitorTab = {
  key: EditMonitorTabKey;
  label: string;
  icon: ComponentType<{ className?: string }>;
};

export type EditMonitorDraftState = {
  activeTab: EditMonitorTabKey;
  selectedMethod: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  requestBodyType: string;
  contentType: string;
  keywordMode: string;
  sslEnabled: boolean;
  dnsEnabled: boolean;
  dnsRecord: string;
  selectedNotification: string;
};
