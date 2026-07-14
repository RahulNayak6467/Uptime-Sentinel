import { LucideIcon } from "lucide-react";
import { Control, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { monitorInfoProps } from "./schemas/monitor-info";

type checkTypeProps =
  | "HTTP/HTTPS"
  | "TCP Port"
  | "Ping"
  | "DNS"
  | "SSL Cert"
  | "Keyword";

export type checkIntervalsTypeProps = "30s" | "1m" | "2m" | "5m" | "10m" | "30m" | "1h"

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

export type newMonitorProps = UseFormRegister<monitorInfoProps>;
export type setValueProps = UseFormSetValue<monitorInfoProps>
export type controlProps = Control<monitorInfoProps>;
export type watchProps = UseFormWatch<monitorInfoProps>;
