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
  selectedMethod: string;
  requestBodyType: string;
  contentType: string;
  followRedirects: boolean;
  keywordMode: string;
  sslEnabled: boolean;
  dnsEnabled: boolean;
  dnsRecord: string;
  selectedNotification: string;
};
