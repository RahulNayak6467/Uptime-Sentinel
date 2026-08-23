"use client";

import { type ReactNode } from "react";
import Link from "next/link";
import {
  BellRing,
  Check,
  ChevronRight,
  CircleAlert,
  ExternalLink,
  Link2,
  Mail,
  MessageSquare,
  MessagesSquare,
  Plus,
  Send,
  Settings2,
  ShieldCheck,
  Siren,
  Smartphone,
  SquareKanban,
  TriangleAlert,
  Users,
  Webhook,
  type LucideIcon,
} from "lucide-react";

type Category = "All" | "Alerting" | "Automation" | "Observability";
type ProviderStatus = "Connected" | "Available" | "Coming soon";

type Provider = {
  name: string;
  icon: LucideIcon;
  category: Exclude<Category, "All">;
  description: string;
  status: ProviderStatus;
  meta: string;
  events?: string;
};

const providers: Provider[] = [
  {
    name: "Email",
    icon: Mail,
    category: "Alerting",
    description: "Send incident and recovery notifications to your verified inbox.",
    status: "Connected",
    meta: "rahul@statusforge.io",
    events: "Down · Recovery · Reminders",
  },
  {
    name: "Slack",
    icon: MessageSquare,
    category: "Alerting",
    description: "Post monitor events to a selected channel with direct incident links.",
    status: "Coming soon",
    meta: "OAuth connection",
  },
  {
    name: "Discord",
    icon: MessagesSquare,
    category: "Alerting",
    description: "Deliver compact outage and recovery updates to a Discord server.",
    status: "Coming soon",
    meta: "Webhook connection",
  },
  {
    name: "Telegram",
    icon: Send,
    category: "Alerting",
    description: "Get instant alerts in a Telegram chat or channel via a bot.",
    status: "Coming soon",
    meta: "Bot API",
  },
  {
    name: "Microsoft Teams",
    icon: Users,
    category: "Alerting",
    description: "Send incident and recovery cards to a Teams channel.",
    status: "Coming soon",
    meta: "Incoming webhook",
  },
  {
    name: "SMS",
    icon: Smartphone,
    category: "Alerting",
    description: "Text critical outage alerts straight to your phone.",
    status: "Coming soon",
    meta: "Twilio",
  },
  {
    name: "Outgoing webhook",
    icon: Webhook,
    category: "Automation",
    description: "Forward signed monitor and incident events to your own endpoint.",
    status: "Coming soon",
    meta: "HMAC-SHA256 signatures",
  },
  {
    name: "PagerDuty",
    icon: TriangleAlert,
    category: "Alerting",
    description: "Trigger and resolve on-call incidents from confirmed monitor state.",
    status: "Coming soon",
    meta: "Events API v2",
  },
  {
    name: "Opsgenie",
    icon: Siren,
    category: "Alerting",
    description: "Route confirmed incidents to your on-call schedules.",
    status: "Coming soon",
    meta: "Alert API",
  },
  {
    name: "Jira",
    icon: SquareKanban,
    category: "Automation",
    description: "Open a Jira issue automatically for each incident.",
    status: "Coming soon",
    meta: "REST API v3",
  },
];

const Panel = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <section className={`sf-panel overflow-hidden ${className}`}>{children}</section>
);

const PanelHeader = ({ icon: Icon, title, description, action }: { icon: LucideIcon; title: string; description: string; action?: ReactNode }) => (
  <header className="flex flex-col gap-2 border-b border-sf-border-faint px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
    <div className="flex min-w-0 items-start gap-3">
      <Icon className="mt-0.5 size-4 shrink-0 text-sf-text-muted" strokeWidth={1.8} />
      <div className="min-w-0">
        <h2 className="text-sm font-semibold tracking-sf-tight text-sf-text">{title}</h2>
        <p className="mt-1 text-[11.5px] leading-relaxed text-sf-text-muted">{description}</p>
      </div>
    </div>
    {action ? <div className="shrink-0">{action}</div> : null}
  </header>
);

const StatusBadge = ({ status }: { status: ProviderStatus }) => {
  if (status === "Connected") {
    return <span className="inline-flex items-center gap-1.5 rounded-[3px] border border-sf-green-border bg-sf-green-bg px-2 py-0.5 text-[10px] font-semibold text-sf-green"><span className="size-1.5 rounded-full bg-sf-green" />Connected</span>;
  }
  if (status === "Available") {
    return <span className="rounded-[3px] border border-sf-blue/25 bg-sf-blue-bg px-2 py-0.5 text-[10px] font-semibold text-sf-blue">Available</span>;
  }
  return <span className="rounded-[3px] border border-sf-border bg-sf-bg px-2 py-0.5 text-[10px] font-semibold text-sf-text-muted">Coming soon</span>;
};

const ConnectedEmail = () => (
  <Panel>
    <PanelHeader
      icon={Link2}
      title="Connected integration"
      description="One active destination owned and managed by you"
      action={<span className="inline-flex items-center gap-1.5 text-[10.5px] font-medium text-sf-green"><Check className="size-3" /> Delivery healthy</span>}
    />
    <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(260px,0.42fr)]">
      <div className="flex items-start gap-4 px-5 py-4">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-[7px] border border-sf-blue/25 bg-sf-blue-bg text-sf-blue">
          <Mail className="size-[18px]" strokeWidth={1.8} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-sf-text">Email notifications</h3>
            <StatusBadge status="Connected" />
          </div>
          <p className="mt-1 font-mono text-[11.5px] text-sf-text-sub">rahul@statusforge.io</p>
          <p className="mt-2 max-w-2xl text-xs leading-5 text-sf-text-muted">Outage, reminder, recovery, performance, and certificate events are delivered to your verified address.</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {["Monitor down", "Recovery", "Degraded", "TLS expiry"].map((event) => <span key={event} className="rounded-[3px] border border-sf-border-faint bg-sf-bg px-2 py-1 text-[10px] text-sf-text-muted">{event}</span>)}
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center gap-2 border-t border-sf-border-faint bg-sf-bg/30 px-5 py-4 lg:border-l lg:border-t-0">
        <div className="flex items-center justify-between text-xs"><span className="text-sf-text-muted">Last delivery</span><span className="font-medium tabular-nums text-sf-text">18s ago</span></div>
        <div className="flex items-center justify-between text-xs"><span className="text-sf-text-muted">24h delivered</span><span className="font-medium tabular-nums text-sf-text">12 of 12</span></div>
        <div className="mt-2 flex gap-2">
          <button type="button" className="h-8 flex-1 rounded-[4px] border border-sf-border bg-sf-surface px-3 text-[11px] font-medium text-sf-text-sub transition-colors hover:bg-sf-bg hover:text-sf-text">Send test</button>
          <Link href="/dashboard/settings" className="flex h-8 flex-1 items-center justify-center gap-1.5 rounded-[4px] bg-sf-text px-3 text-[11px] font-semibold text-sf-btn-text transition-colors hover:bg-sf-blue hover:text-white">Settings <ChevronRight className="size-3" /></Link>
        </div>
      </div>
    </div>
  </Panel>
);

const ProviderAction = ({ status }: { status: ProviderStatus }) => {
  if (status === "Connected") {
    return <Link href="/dashboard/settings" className="flex h-8 items-center justify-center rounded-[5px] border border-sf-border bg-sf-surface px-4 text-[11.5px] font-semibold text-sf-text-sub transition-colors hover:bg-sf-bg hover:text-sf-text">Manage</Link>;
  }
  if (status === "Available") {
    return <button type="button" className="h-8 rounded-[5px] border border-sf-border bg-sf-surface px-4 text-[11.5px] font-semibold text-sf-text-sub transition-colors hover:bg-sf-bg hover:text-sf-text">Export</button>;
  }
  return <button type="button" disabled className="h-8 cursor-not-allowed rounded-[5px] border border-sf-border-faint bg-sf-bg px-4 text-[11.5px] font-semibold text-sf-text-muted">Connect</button>;
};

const ProviderRow = ({ provider }: { provider: Provider }) => {
  const Icon = provider.icon;
  return (
    <div className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-sf-bg/35">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-[8px] border border-sf-border bg-sf-bg/60 text-sf-text-muted">
        <Icon className="size-[18px]" strokeWidth={1.75} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="text-[13.5px] font-semibold text-sf-text">{provider.name}</h3>
          <StatusBadge status={provider.status} />
        </div>
        <p className="mt-0.5 truncate text-[11.5px] leading-[1.5] text-sf-text-muted">{provider.description}</p>
      </div>
      <div className="shrink-0"><ProviderAction status={provider.status} /></div>
    </div>
  );
};

const ProviderCatalog = () => (
  <Panel>
    <PanelHeader icon={Plus} title="Integrations" description="Connect StatusForge to the tools you already use" action={<span className="text-[10.5px] text-sf-text-muted">1 connected</span>} />
    <div className="divide-y divide-sf-border-faint">
      {providers.map((provider) => <ProviderRow key={provider.name} provider={provider} />)}
    </div>
  </Panel>
);

const OwnershipNote = () => (
  <Panel>
    <PanelHeader icon={ShieldCheck} title="Connection ownership" description="Designed for one StatusForge owner" />
    <div className="divide-y divide-sf-border-faint px-5">
      <div className="flex items-start gap-3 py-3.5"><Settings2 className="mt-0.5 size-4 shrink-0 text-sf-text-muted" /><div><p className="text-xs font-medium text-sf-text">Notification behavior stays in Settings</p><p className="mt-1 text-[11px] leading-relaxed text-sf-text-muted">Recipients, alert rules, grouping, reminders, and quiet hours are configured once for your account.</p></div></div>
      <div className="flex items-start gap-3 py-3.5"><CircleAlert className="mt-0.5 size-4 shrink-0 text-sf-text-muted" /><div><p className="text-xs font-medium text-sf-text">No team routing or role assignment</p><p className="mt-1 text-[11px] leading-relaxed text-sf-text-muted">Connections belong to you. There are no workspace owners, member permissions, or team escalation targets.</p></div></div>
      <div className="flex items-start gap-3 py-3.5"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-sf-text-muted" /><div><p className="text-xs font-medium text-sf-text">Secrets remain write-only</p><p className="mt-1 text-[11px] leading-relaxed text-sf-text-muted">Tokens and signing secrets would be encrypted and shown only when initially created.</p></div></div>
    </div>
  </Panel>
);

const IntegrationsPage = () => (
  <div className="min-h-full">
    <header className="sf-page-header bg-sf-surface/90 backdrop-blur-xl">
      <div className="min-w-0"><div className="flex items-center gap-2.5"><h1 className="sf-page-title">Integrations</h1><span className="rounded-[3px] border border-sf-border bg-sf-bg px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-sf-text-muted">Preview</span></div><p className="sf-page-subtitle truncate">Connect your alerts and monitoring data to external tools</p></div>
      <Link href="/dashboard/settings" className="flex h-8 w-full items-center justify-center gap-2 rounded-[4px] border border-sf-border bg-sf-surface px-3 text-[11px] font-medium text-sf-text-sub shadow-sm transition-colors hover:bg-sf-bg hover:text-sf-text sm:w-auto"><Settings2 className="size-3.5" /> Notification settings</Link>
    </header>

    <main className="sf-page-content space-y-4 pb-12">
      <div className="flex flex-col gap-2 border-b border-sf-border-faint pb-3 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-2 text-xs text-sf-text-sub"><span className="size-1.5 rounded-full bg-sf-green" /><span className="font-medium text-sf-text">1 integration connected</span><span className="text-sf-text-muted">· No delivery failures in 30 days</span></div><span className="flex items-center gap-1.5 text-[10.5px] text-sf-text-muted"><ShieldCheck className="size-3" /> Solo account · credentials owned by you</span></div>
      <ConnectedEmail />
      <ProviderCatalog />
      <OwnershipNote />
      <div className="flex items-start gap-2.5 rounded-[5px] border border-sf-border-faint bg-sf-surface px-4 py-3 text-[11px] leading-relaxed text-sf-text-muted"><BellRing className="mt-0.5 size-3.5 shrink-0 text-sf-blue" /><p>Frontend concept only. Email is the existing active channel; additional provider cards and delivery data are hardcoded until their roadmap versions are implemented.</p><a href="https://resend.com/docs" target="_blank" rel="noreferrer" className="ml-auto hidden shrink-0 items-center gap-1 font-medium text-sf-blue hover:underline sm:flex">Provider docs <ExternalLink className="size-3" /></a></div>
    </main>
  </div>
);

export default IntegrationsPage;
