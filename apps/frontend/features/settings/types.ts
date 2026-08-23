import type { LucideIcon } from "lucide-react";

// One entry per settings screen. V7 screens are fully built; the rest are
// coming-soon (see settingsNav.comingSoon).
export type SettingsSectionId =
  | "account"
  | "monitoring-defaults"
  | "notifications"
  | "escalation"
  | "maintenance"
  | "security"
  | "api-webhooks"
  | "probe-regions"
  | "status-page";

export type SettingsNavItem = {
  id: SettingsSectionId;
  label: string;
  // Shown as the subtitle in the section header (see settings-page).
  description: string;
  icon: LucideIcon;
  comingSoon?: boolean;
};

export type SettingsNavGroup = {
  heading: string;
  items: SettingsNavItem[];
};
