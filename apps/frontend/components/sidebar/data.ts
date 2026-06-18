import {
  Activity,
  ChartColumn,
  Globe,
  LayoutGrid,
  TriangleAlert,
  Bell,
  Users,
  Settings,
  CreditCard,
  Plug,
} from "lucide-react";

export const monitorItems = [
  {
    id: crypto.randomUUID(),
    icon: LayoutGrid,
    label: "Overview",
  },
  {
    id: crypto.randomUUID(),
    icon: Activity,
    label: "Monitors",
    number: 21,
    color: "9CA3AF", // gray badge background
    backgroundColor: "F3F4F6",
  },
  {
    id: crypto.randomUUID(),
    icon: TriangleAlert,
    label: "Incidents",
    number: 1,
    color: "#DC2626", // red badge background
    backgroundColor: "#FEE2E2",
  },
  {
    id: crypto.randomUUID(),
    icon: Globe,
    label: "Status pages",
    comingSoon: true,
  },
  {
    id: crypto.randomUUID(),
    icon: ChartColumn,
    label: "Analytics",
    comingSoon: true,
  },
];

export const configureItems = [
  {
    id: crypto.randomUUID(),
    icon: Bell,
    label: "Email Alerts",
  },
  {
    id: crypto.randomUUID(),
    icon: Plug,
    label: "Integrations",
    comingSoon: true,
  },
];

export const workspaceItems = [
  {
    id: crypto.randomUUID(),
    icon: Users,
    label: "Team",
    comingSoon: true,
  },
  {
    id: crypto.randomUUID(),
    icon: Settings,
    label: "Settings",
    comingSoon: true,
  },
  {
    id: crypto.randomUUID(),
    icon: CreditCard,
    label: "Billing",
    comingSoon: true,
  },
];
