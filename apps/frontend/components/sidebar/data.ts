import {
  Activity,
  ChartColumn,
  LayoutGrid,
  TriangleAlert,
  Settings,
  type LucideIcon,
} from "lucide-react";

type NavItem = {
  id: string;
  icon: LucideIcon;
  label: string;
  href: string;
  color?: string;
  backgroundColor?: string;
  comingSoon?: boolean;
};

export const monitorItems: NavItem[] = [
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
    color: "var(--color-sf-blue)",
    backgroundColor: "var(--color-sf-blue-bg)",
  },
  {
    id: crypto.randomUUID(),
    icon: TriangleAlert,
    label: "Incidents",
    href: "/dashboard/incidents",
    color: "var(--color-sf-red)",
    backgroundColor: "var(--color-sf-red-bg)",
  },
  {
    id: crypto.randomUUID(),
    icon: ChartColumn,
    label: "Analytics",
    href: "/dashboard/analytics",
  },
];

export const configureItems: NavItem[] = [];

export const workspaceItems: NavItem[] = [
  {
    id: crypto.randomUUID(),
    icon: Settings,
    label: "Settings",
    href: "/dashboard/settings",
    comingSoon: false,
  },
];
