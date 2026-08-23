"use client";

import {
  Activity,
  BarChart3,
  Link2,
  MessageSquare,
  MessagesSquare,
  Siren,
  SquareKanban,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";
import { GhostButton, Pill, PrimaryButton, SettingCard } from "../form-controls";

type Integration = {
  icon: LucideIcon;
  name: string;
  description: string;
  connected?: boolean;
};

// Integrations on the StatusForge roadmap. All alert-outbound integrations are a
// simple POST to their REST API; Jira (issue creation) is the only moderate one.
// Connected cards show live connection context (channel, endpoint count, key type)
// in place of the generic description.
const integrations: Integration[] = [
  { icon: MessageSquare, name: "Slack", description: "#incidents", connected: true },
  { icon: TriangleAlert, name: "PagerDuty", description: "Engineering escalation", connected: true },
  { icon: Link2, name: "Webhook", description: "2 endpoints", connected: true },
  { icon: Activity, name: "Datadog", description: "Forward metrics & events" },
  { icon: Siren, name: "Opsgenie", description: "Route alerts to schedules" },
  { icon: MessagesSquare, name: "Discord", description: "Post alerts to a server" },
  { icon: SquareKanban, name: "Jira", description: "Open an issue per incident" },
  { icon: BarChart3, name: "Grafana", description: "Read-only key", connected: true },
];

const IntegrationCard = ({ icon: Icon, name, description, connected = false }: Integration) => (
  <div className="flex items-center justify-between gap-3 rounded-md border border-sf-border bg-sf-bg/15 px-3 py-2.5">
    <div className="flex min-w-0 items-center gap-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-md border border-sf-border bg-sf-bg/20 text-sf-text-muted">
        <Icon className="size-4" strokeWidth={1.75} aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-[13px] font-semibold text-sf-text">{name}</p>
          {connected ? <Pill tone="green">Connected</Pill> : null}
        </div>
        <p className="truncate text-xs text-sf-text-muted">{description}</p>
      </div>
    </div>
    {connected ? <GhostButton>Manage</GhostButton> : <PrimaryButton>Connect</PrimaryButton>}
  </div>
);

const IntegrationsSection = () => (
  <div className="space-y-4">
    <SettingCard
      icon={Link2}
      title="Integrations"
      description="Connect StatusForge to the tools you already use"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {integrations.map((integration) => (
          <IntegrationCard key={integration.name} {...integration} />
        ))}
      </div>
    </SettingCard>
  </div>
);

export default IntegrationsSection;
