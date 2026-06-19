import {
  Activity,
  ChartColumn,
  Globe,
  LayoutGrid,
  TriangleAlert,
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
    href: "/dashboard/overview",
  },
  {
    id: crypto.randomUUID(),
    icon: Activity,
    label: "Monitors",
    href: "/dashboard/monitors",
    number: 21,
    color: "9CA3AF",
    backgroundColor: "F3F4F6",
  },
  {
    id: crypto.randomUUID(),
    icon: TriangleAlert,
    label: "Incidents",
    href: "/dashboard/incidents",
    number: 1,
    color: "#DC2626",
    backgroundColor: "#FEE2E2",
  },
  {
    id: crypto.randomUUID(),
    icon: Globe,
    label: "Status pages",
    href: "#",
    comingSoon: true,
  },
  {
    id: crypto.randomUUID(),
    icon: ChartColumn,
    label: "Analytics",
    href: "#",
    comingSoon: true,
  },
];

export const configureItems = [
  {
    id: crypto.randomUUID(),
    icon: Plug,
    label: "Integrations",
    href: "/dashboard/emailalerts",
  },
];

export const workspaceItems = [
  {
    id: crypto.randomUUID(),
    icon: Users,
    label: "Team",
    href: "#",
    comingSoon: true,
  },
  {
    id: crypto.randomUUID(),
    icon: Settings,
    label: "Settings",
    href: "#",
    comingSoon: true,
  },
  {
    id: crypto.randomUUID(),
    icon: CreditCard,
    label: "Billing",
    href: "#",
    comingSoon: true,
  },
];
