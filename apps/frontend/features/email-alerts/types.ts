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
