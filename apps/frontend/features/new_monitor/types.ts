import { LucideIcon } from "lucide-react";
import { Control, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { httpMonitorProps, tlsMonitorProps } from "./schemas/monitor-info";

type checkTypeProps =
  | "HTTP/HTTPS"
  | "TCP Port"
  | "VPS"
  | "DNS"
  | "TLS Cert"
  | "Webhook Events";

export type checkIntervalsTypeProps =
  | "30s"
  | "1m"
  | "2m"
  | "5m"
  | "10m"
  | "30m"
  | "1h"
  | "3h"
  | "6h"
  | "12h"
  | "24h";

export type monitorTypeProps = {
  icon: LucideIcon;
  checkType: checkTypeProps;
  featuresOffered: string;
  isActive?: boolean;
  onClick?: () => void;
  comingSoon?: boolean;
};

export type alertConditionsProps = {
  // register?:  newMonitorProps;
  alertType: string;
  alertText: string;
  alertMessage: "failures" | "success" | "ms";
};

export type alertCondition = {
  control: controlProps;
  error: string | undefined;
} & alertConditionsProps

export type notificationChannelProps = {
  id: string;
  label: string;
  icon: LucideIcon;
  comingSoon?: boolean;
};

export type newMonitorProps = UseFormRegister<httpMonitorProps>;
export type setValueProps = UseFormSetValue<httpMonitorProps>;
export type controlProps = Control<httpMonitorProps>;
export type watchProps = UseFormWatch<httpMonitorProps>;

export type tlsRegisterPayloadProps = {
  monitorType: "tls";
  url: string;
  monitorName: string;
  intervalSeconds: number;
  requestTimeoutMS: number;
  responseTimeThresholdMS: number;
  port: number;
  minTlsVersion: tlsMonitorProps["minTlsVersion"];
  warningThresholdDays: number;
  expiryAlertThresholds: number[];
  enabledAlerts: tlsMonitorProps["enabledAlerts"];
  linkedMonitorId: string | null;
};
