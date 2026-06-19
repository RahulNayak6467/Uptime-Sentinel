import { LucideIcon } from "lucide-react";

export type monitorStatsProps = {
  icon: LucideIcon;
  label: string;
  href: string;
  number?: number;
  backgroundColor?: string;
  color?: string;
  isActive?: boolean;
  comingSoon?: boolean;
};
