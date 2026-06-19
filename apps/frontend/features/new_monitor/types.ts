import { LucideIcon } from "lucide-react";

type checkTypeProps =
  | "HTTP/HTTPS"
  | "TCP Port"
  | "Ping"
  | "DNS"
  | "SSL Cert"
  | "Keyword";

export type monitorTypeProps = {
  icon: LucideIcon;
  checkType: checkTypeProps;
  featuresOffered: string;
  isActive?: boolean;
  onClick?: () => void;
  comingSoon?: boolean;
};

export type alertConditionsProps = {
  alertType: string;
  alertText: string;
  alertMessage: "failures" | "success" | "ms";
};

export type notificationChannelProps = {
  id: string;
  label: string;
  icon: LucideIcon;
  comingSoon?: boolean;
};
