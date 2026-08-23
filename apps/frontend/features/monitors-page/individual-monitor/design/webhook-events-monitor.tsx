"use client";

import type { ReactNode } from "react";
import {
  Activity,
  BellRing,
  Braces,
  Clock3,
  FileCheck2,
  History,
  Radio,
  Settings2,
  ShieldCheck,
  Webhook,
  type LucideIcon,
} from "lucide-react";
import { TrendChart } from "../monitor-detail-charts";
import {
  CheckRow,
  KeyValue,
  KeyValueList,
  Panel,
  Pill,
  TableScroll,
  type Tone,
} from "../monitor-detail-primitives";

const toneIconClass: Record<Tone, string> = {
  neutral: "text-sf-text-muted",
  info: "text-[var(--sf-protocol-accent)]",
  positive: "text-sf-green",
  warning: "text-sf-amber",
  negative: "text-sf-red",
};

const WebhookPanelHeader = ({
  icon: Icon,
  title,
  meta,
  tone = "neutral",
}: {
  icon: LucideIcon;
  title: string;
  meta?: ReactNode;
  tone?: Tone;
}) => (
  <header className="flex min-h-11 flex-col items-start justify-between gap-1.5 border-b border-sf-border-faint px-4 py-2 sm:flex-row sm:items-center sm:gap-4">
    <div className="flex min-w-0 items-center gap-3">
      <Icon
        className={`size-4 shrink-0 ${toneIconClass[tone]}`}
        strokeWidth={1.75}
        aria-hidden="true"
      />
      <h3 className="truncate text-sm font-semibold tracking-[-0.015em] text-sf-text">
        {title}
      </h3>
    </div>
    {meta ? (
      <div className="text-left text-[11px] leading-relaxed text-sf-text-muted sm:shrink-0 sm:text-right">
        {meta}
      </div>
    ) : null}
  </header>
);

const mockWebhookMonitor = {
  name: "Stripe production events",
  endpoint: "POST /events/evt_live_••••8f2a",
  status: "Receiving",
  lastEvent: "24 seconds ago",
  nextExpected: "in 4m 36s",
  events24h: "1,248",
  validRate: "99.8%",
  rejected: "3",
  processingP95: "42ms",
  latestType: "payment.succeeded",
  currentSilence: "24s",
  categories: [
    "00:00", "01:00", "02:00", "03:00", "04:00", "05:00",
    "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
    "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
    "18:00", "19:00", "20:00", "21:00", "22:00", "now",
  ],
  hourlyVolume: [
    31, 28, 24, 22, 19, 23, 34, 48, 61, 67, 72, 63,
    58, 54, 62, 76, 81, 74, 69, 64, 57, 51, 48, 62,
  ],
  eventTypes: [
    { type: "payment.succeeded", count: "872", valid: "100%", lastSeen: "24s ago", tone: "positive" as Tone },
    { type: "payment.failed", count: "214", valid: "99.5%", lastSeen: "3m ago", tone: "positive" as Tone },
    { type: "refund.completed", count: "96", valid: "100%", lastSeen: "18m ago", tone: "positive" as Tone },
    { type: "subscription.cancelled", count: "66", valid: "98.5%", lastSeen: "41m ago", tone: "warning" as Tone },
  ],
  deliveries: [
    { id: "evt_01JZ9AP", receivedAt: "14:32:18", type: "payment.succeeded", result: "Accepted", size: "3.8 KB", processing: "31ms", tone: "positive" as Tone },
    { id: "evt_01JZ98K", receivedAt: "14:29:05", type: "payment.failed", result: "Accepted", size: "4.1 KB", processing: "37ms", tone: "positive" as Tone },
    { id: "evt_01JZ91V", receivedAt: "14:24:42", type: "payment.succeeded", result: "Accepted", size: "3.7 KB", processing: "29ms", tone: "positive" as Tone },
    { id: "evt_01JZ8TW", receivedAt: "14:18:11", type: "subscription.cancelled", result: "Rule warning", size: "2.9 KB", processing: "44ms", tone: "warning" as Tone },
    { id: "evt_01JZ8M2", receivedAt: "14:13:36", type: "refund.completed", result: "Accepted", size: "3.2 KB", processing: "35ms", tone: "positive" as Tone },
  ],
  config: {
    method: "POST",
    contentType: "application/json",
    authentication: "Bearer token",
    signature: "HMAC-SHA256",
    signatureHeader: "X-StatusForge-Signature",
    timestampTolerance: "5 minutes",
    maximumPayload: "256 KB",
    expectedInterval: "Every 5 minutes",
    graceWindow: "2 minutes",
    requiredPath: "$.event",
    acceptedEvents: "4 event types",
  },
  alertRules: [
    { label: "Missing event", description: "No valid event arrives inside the 5-minute interval plus 2-minute grace window.", enabled: true },
    { label: "Signature failure", description: "The HMAC signature or timestamp cannot be verified.", enabled: true },
    { label: "Invalid payload", description: "JSON is malformed or required paths are missing.", enabled: true },
    { label: "Failure event", description: "The payload matches payment.failed.", enabled: true },
    { label: "Volume spike", description: "Hourly traffic exceeds three times the 7-day baseline.", enabled: false },
    { label: "Recovery", description: "A valid event arrives after a missing-event incident.", enabled: true },
  ],
  history: [
    { id: "wh-h-1", title: "Delivery healthy", description: "Expected event cadence and validation rules are currently passing.", occurredAt: "Today · 14:32", tone: "positive" as Tone },
    { id: "wh-h-2", title: "Invalid signature blocked", description: "One request was rejected before its payload was evaluated.", occurredAt: "Today · 11:08", tone: "warning" as Tone },
    { id: "wh-h-3", title: "Missing window recovered", description: "Delivery resumed 38 seconds into the configured grace window.", occurredAt: "Aug 10 · 03:16", tone: "neutral" as Tone },
    { id: "wh-h-4", title: "Monitor created", description: "Receiver token and HMAC secret were generated.", occurredAt: "Jul 28 · 09:40", tone: "neutral" as Tone },
  ],
} as const;

const summaryStats = [
  { label: "Events · 24h", value: mockWebhookMonitor.events24h, hint: "52 per hour average" },
  { label: "Valid", value: mockWebhookMonitor.validRate, hint: "1,245 accepted" },
  { label: "Rejected", value: mockWebhookMonitor.rejected, hint: "2 signature · 1 payload" },
  { label: "Processing · p95", value: mockWebhookMonitor.processingP95, hint: "58ms maximum" },
  { label: "Last event", value: mockWebhookMonitor.latestType, hint: "Accepted" },
  { label: "Silence", value: mockWebhookMonitor.currentSilence, hint: "7m alert boundary" },
] as const;

const StatusSummary = () => (
  <div className="space-y-2.5">
    <Panel className="relative bg-sf-surface">
      <div className="flex flex-col gap-3 px-[18px] py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-start gap-3.5">
          <span className="flex size-[34px] shrink-0 items-center justify-center rounded-[9px] border border-sf-green-border bg-sf-green-bg text-sf-green">
            <Webhook className="size-[17px]" strokeWidth={1.8} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-[16.5px] font-semibold leading-none tracking-[-0.015em] text-sf-text">
                {mockWebhookMonitor.name}
              </h1>
              <Pill tone="positive" dot>{mockWebhookMonitor.status}</Pill>
              <Pill tone="positive">HMAC verified</Pill>
              <Pill tone="neutral">Hardcoded preview</Pill>
            </div>
            <p className="mt-2 font-mono text-[11.5px] text-sf-text-sub">
              {mockWebhookMonitor.endpoint}
            </p>
            <p className="mt-1 max-w-4xl text-[12.5px] leading-[1.55] text-sf-text-muted">
              Events are arriving on schedule. Authentication, signature, payload and event-type rules passed for the latest delivery.
            </p>
          </div>
        </div>

        <dl className="grid shrink-0 grid-cols-2 divide-x divide-sf-border-faint">
          <div className="min-w-32 px-4 py-1">
            <dt className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-sf-text-muted">
              <Clock3 className="size-3" aria-hidden="true" />
              Last event
            </dt>
            <dd className="mt-1.5 text-xs font-medium text-sf-text">{mockWebhookMonitor.lastEvent}</dd>
          </div>
          <div className="min-w-32 px-4 py-1">
            <dt className="text-[10px] font-semibold uppercase tracking-[0.1em] text-sf-text-muted">Next expected</dt>
            <dd className="mt-1.5 text-xs font-medium text-[var(--sf-protocol-accent)]">{mockWebhookMonitor.nextExpected}</dd>
          </div>
        </dl>
      </div>
    </Panel>

    <Panel>
      <dl className="grid grid-cols-2 gap-px bg-sf-border-faint sm:grid-cols-3 xl:grid-cols-6">
        {summaryStats.map((stat) => (
          <div key={stat.label} className="min-w-0 bg-sf-surface px-4 py-3">
            <dt className="text-[10px] font-semibold uppercase tracking-[0.11em] text-sf-text-muted">{stat.label}</dt>
            <dd className={`mt-2 truncate font-semibold leading-none tracking-[-0.035em] tabular-nums text-sf-text ${stat.label === "Last event" ? "font-mono text-[14px]" : "text-[23px]"}`}>
              {stat.value}
            </dd>
            <dd className="mt-1.5 text-[11px] leading-relaxed text-sf-text-muted">{stat.hint}</dd>
          </div>
        ))}
      </dl>
    </Panel>
  </div>
);

const EventVolumeCard = () => (
  <Panel>
    <WebhookPanelHeader
      icon={Activity}
      tone="info"
      title="Event volume"
      meta="Accepted requests · Last 24 hours"
    />
    <div className="px-4 pb-2 pt-2.5">
      <TrendChart
        values={[...mockWebhookMonitor.hourlyVolume]}
        categories={[...mockWebhookMonitor.categories]}
        tone="info"
        unit=" events"
        height={215}
      />
    </div>
    <div className="grid grid-cols-2 gap-px border-t border-sf-border-faint bg-sf-border-faint sm:grid-cols-4">
      {[
        ["Current hour", "62", "12 received so far"],
        ["Hourly average", "52", "Last 24 hours"],
        ["Peak hour", "81", "16:00–17:00"],
        ["Rejected", "3", "0.2% of requests"],
      ].map(([label, value, hint]) => (
        <div key={label} className="bg-sf-surface px-4 py-2.5 text-center">
          <p className="text-lg font-semibold tabular-nums text-sf-text">{value}</p>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-sf-text-muted">{label}</p>
          <p className="mt-1 text-[10.5px] text-sf-text-muted">{hint}</p>
        </div>
      ))}
    </div>
  </Panel>
);

const DeliveryContinuityCard = () => (
  <Panel>
    <WebhookPanelHeader
      icon={Radio}
      title="Delivery continuity"
      meta={<Pill tone="positive">No missed windows</Pill>}
    />
    <div className="px-4 py-3.5">
      <div className="grid grid-cols-12 gap-1 sm:grid-cols-[repeat(24,minmax(0,1fr))]">
        {Array.from({ length: 48 }, (_, index) => (
          <span
            key={index}
            className="h-3 rounded-[2px] bg-sf-green/80"
            title={`${48 - index} intervals ago · received`}
          />
        ))}
      </div>
      <div className="mt-2 flex items-center justify-between text-[10.5px] text-sf-text-muted">
        <span>4 hours ago</span>
        <span>One cell per 5-minute window</span>
        <span>now</span>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-px border-t border-sf-border-faint bg-sf-border-faint sm:grid-cols-4">
      {[
        ["Expected", "Every 5m"],
        ["Grace", "2 minutes"],
        ["Current silence", "24 seconds"],
        ["Missed windows", "0"],
      ].map(([label, value]) => (
        <div key={label} className="bg-sf-surface px-4 py-3 text-center">
          <p className="text-sm font-semibold tabular-nums text-sf-text">{value}</p>
          <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-sf-text-muted">{label}</p>
        </div>
      ))}
    </div>
  </Panel>
);

const LatestValidationCard = () => (
  <Panel>
    <WebhookPanelHeader
      icon={FileCheck2}
      title="Latest event validation"
      meta={<Pill tone="positive">6 of 6 passed</Pill>}
    />
    <div className="divide-y divide-sf-border-faint px-4">
      <CheckRow tone="positive" title="Bearer token" description="Receiver token matched the configured monitor." status="Pass" />
      <CheckRow tone="positive" title="HMAC signature" description="SHA-256 digest and timestamp were verified." status="Pass" />
      <CheckRow tone="positive" title="JSON content" description="application/json · 3.8 KB of 256 KB maximum." status="Pass" />
      <CheckRow tone="positive" title="Required field" description="$.event was present and contained an accepted value." status="Pass" />
      <CheckRow tone="positive" title="Payload rule" description="$.status equals succeeded." status="Pass" />
      <CheckRow tone="positive" title="Replay protection" description="Event ID and timestamp were not previously accepted." status="Pass" />
    </div>
  </Panel>
);

const PayloadPreviewCard = () => (
  <Panel>
    <WebhookPanelHeader icon={Braces} title="Latest payload" meta="Sensitive fields redacted" />
    <div className="p-4">
      <pre className="overflow-x-auto rounded-md border border-sf-border-faint bg-sf-bg px-4 py-3 font-mono text-[11.5px] leading-6 text-sf-text-sub">
{`{
  "id": "evt_01JZ9AP",
  "event": "payment.succeeded",
  "status": "succeeded",
  "amount": 4999,
  "currency": "usd",
  "customer_id": "[redacted]"
}`}
      </pre>
      <p className="mt-2 text-[11px] leading-relaxed text-sf-text-muted">
        Payload bodies should be encrypted at rest and retained only as long as debugging requires.
      </p>
    </div>
  </Panel>
);

const EventTypesCard = () => (
  <Panel>
    <WebhookPanelHeader icon={Braces} title="Event types" meta="Accepted traffic · Last 24 hours" />
    <TableScroll>
      <table className="w-full min-w-[620px] text-left text-xs">
        <thead className="border-b border-sf-border bg-sf-bg/70 text-[10px] uppercase tracking-[0.1em] text-sf-text-muted">
          <tr>
            <th className="px-4 py-2.5 font-semibold">Event type</th>
            <th className="px-3 py-2.5 text-right font-semibold">Count</th>
            <th className="px-3 py-2.5 text-right font-semibold">Valid</th>
            <th className="px-4 py-2.5 text-right font-semibold">Last seen</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-sf-border-faint">
          {mockWebhookMonitor.eventTypes.map((row) => (
            <tr key={row.type} className="transition-colors hover:bg-sf-bg/60">
              <td className="px-4 py-2.5 font-mono text-[11.5px] font-semibold text-sf-text">{row.type}</td>
              <td className="px-3 py-2.5 text-right tabular-nums text-sf-text">{row.count}</td>
              <td className={`px-3 py-2.5 text-right tabular-nums ${row.tone === "warning" ? "text-sf-amber" : "text-sf-green"}`}>{row.valid}</td>
              <td className="px-4 py-2.5 text-right tabular-nums text-sf-text-muted">{row.lastSeen}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableScroll>
  </Panel>
);

const RecentDeliveriesCard = () => (
  <Panel>
    <WebhookPanelHeader icon={Radio} title="Recent deliveries" meta="Newest first · Request bodies not stored in this preview" />
    <TableScroll>
      <table className="w-full min-w-[820px] text-left text-xs">
        <thead className="border-b border-sf-border bg-sf-bg/70 text-[10px] uppercase tracking-[0.1em] text-sf-text-muted">
          <tr>
            <th className="px-4 py-2.5 font-semibold">Received</th>
            <th className="px-3 py-2.5 font-semibold">Event ID</th>
            <th className="px-3 py-2.5 font-semibold">Type</th>
            <th className="px-3 py-2.5 font-semibold">Result</th>
            <th className="px-3 py-2.5 text-right font-semibold">Size</th>
            <th className="px-4 py-2.5 text-right font-semibold">Processing</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-sf-border-faint">
          {mockWebhookMonitor.deliveries.map((row) => (
            <tr key={row.id} className="transition-colors hover:bg-sf-bg/60">
              <td className="px-4 py-2.5 font-mono text-[11.5px] tabular-nums text-sf-text-muted">{row.receivedAt}</td>
              <td className="px-3 py-2.5 font-mono text-[11.5px] text-sf-text-sub">{row.id}</td>
              <td className="px-3 py-2.5 font-mono text-[11.5px] text-sf-text">{row.type}</td>
              <td className="px-3 py-2.5"><Pill tone={row.tone}>{row.result}</Pill></td>
              <td className="px-3 py-2.5 text-right tabular-nums text-sf-text-muted">{row.size}</td>
              <td className="px-4 py-2.5 text-right tabular-nums text-sf-text">{row.processing}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableScroll>
  </Panel>
);

const ConfigurationCard = () => (
  <Panel>
    <WebhookPanelHeader icon={Settings2} title="Receiver configuration" meta="Read-only preview" />
    <div className="grid md:grid-cols-2 md:divide-x md:divide-sf-border-faint">
      <KeyValueList className="[&>div]:py-2.5 [&>div>dd]:!text-xs [&>div>dt]:!text-xs">
        <KeyValue label="Method" mono>{mockWebhookMonitor.config.method}</KeyValue>
        <KeyValue label="Content type" mono>{mockWebhookMonitor.config.contentType}</KeyValue>
        <KeyValue label="Authentication">{mockWebhookMonitor.config.authentication}</KeyValue>
        <KeyValue label="Signature">{mockWebhookMonitor.config.signature}</KeyValue>
        <KeyValue label="Signature header" mono>{mockWebhookMonitor.config.signatureHeader}</KeyValue>
      </KeyValueList>
      <KeyValueList className="[&>div]:py-2.5 [&>div>dd]:!text-xs [&>div>dt]:!text-xs">
        <KeyValue label="Timestamp tolerance">{mockWebhookMonitor.config.timestampTolerance}</KeyValue>
        <KeyValue label="Maximum payload">{mockWebhookMonitor.config.maximumPayload}</KeyValue>
        <KeyValue label="Expected delivery">{mockWebhookMonitor.config.expectedInterval}</KeyValue>
        <KeyValue label="Grace window">{mockWebhookMonitor.config.graceWindow}</KeyValue>
        <KeyValue label="Required JSON path" mono>{mockWebhookMonitor.config.requiredPath}</KeyValue>
        <KeyValue label="Accepted values">{mockWebhookMonitor.config.acceptedEvents}</KeyValue>
      </KeyValueList>
    </div>
  </Panel>
);

const AlertRulesCard = () => {
  const activeCount = mockWebhookMonitor.alertRules.filter((rule) => rule.enabled).length;
  return (
    <Panel>
      <WebhookPanelHeader icon={BellRing} title="Webhook alert rules" meta={`${activeCount} of ${mockWebhookMonitor.alertRules.length} active`} />
      <div className="grid md:grid-cols-2">
        {mockWebhookMonitor.alertRules.map((rule) => (
          <div key={rule.label} className="flex items-start gap-2.5 border-b border-sf-border-faint px-4 py-2.5 last:border-b-0 md:[&:nth-last-child(-n+2)]:border-b-0 md:odd:border-r md:odd:border-r-sf-border-faint">
            <span className={`mt-1.5 size-2 shrink-0 rounded-full ${rule.enabled ? "bg-sf-green" : "border border-sf-border bg-sf-bg"}`} aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-xs font-semibold text-sf-text">{rule.label}</p>
                <span className={`shrink-0 text-[10.5px] font-medium ${rule.enabled ? "text-sf-green" : "text-sf-text-muted"}`}>{rule.enabled ? "Active" : "Inactive"}</span>
              </div>
              <p className="mt-0.5 text-[11.5px] leading-relaxed text-sf-text-muted">{rule.description}</p>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
};

const eventDot: Record<Tone, string> = {
  neutral: "bg-sf-text-muted",
  info: "bg-[var(--sf-protocol-accent)]",
  positive: "bg-sf-green",
  warning: "bg-sf-amber",
  negative: "bg-sf-red",
};

const EventHistoryCard = () => (
  <Panel>
    <WebhookPanelHeader icon={History} title="Webhook event history" meta="Validation and delivery state changes" />
    <div className="px-4 py-1">
      {mockWebhookMonitor.history.map((event, index) => (
        <div key={event.id} className="relative py-2.5 pl-8">
          {index < mockWebhookMonitor.history.length - 1 ? <span className="absolute bottom-0 left-[7px] top-7 w-px bg-sf-border" /> : null}
          <span className={`absolute left-0 top-[18px] size-3.5 rounded-full border-[3px] border-sf-surface ${eventDot[event.tone]}`} />
          <div>
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <p className={`text-xs font-semibold ${event.tone === "warning" ? "text-sf-amber" : event.tone === "positive" ? "text-sf-green" : "text-sf-text"}`}>{event.title}</p>
              <time className="font-mono text-[11px] tabular-nums text-sf-text-muted">{event.occurredAt}</time>
            </div>
            <p className="mt-1 text-xs leading-5 text-sf-text-muted">{event.description}</p>
          </div>
        </div>
      ))}
    </div>
  </Panel>
);

const WebhookEventsMonitor = () => (
  <section id="webhook-events-monitoring" className="protocol-detail-theme scroll-mt-16 space-y-3">
    <StatusSummary />

    <section aria-labelledby="webhook-delivery-heading">
      <h2 id="webhook-delivery-heading" className="sr-only">Webhook event delivery</h2>
      <EventVolumeCard />
      <div className="mt-3">
        <DeliveryContinuityCard />
      </div>
      <div className="mt-3 grid items-start gap-3 lg:grid-cols-2">
        <LatestValidationCard />
        <PayloadPreviewCard />
      </div>
    </section>

    <section aria-labelledby="webhook-traffic-heading">
      <h2 id="webhook-traffic-heading" className="sr-only">Webhook event traffic</h2>
      <EventTypesCard />
      <div className="mt-3">
        <RecentDeliveriesCard />
      </div>
    </section>

    <section aria-labelledby="webhook-operations-heading">
      <h2 id="webhook-operations-heading" className="sr-only">Webhook configuration and operations</h2>
      <ConfigurationCard />
      <div className="mt-3">
        <AlertRulesCard />
      </div>
      <div className="mt-3">
        <EventHistoryCard />
      </div>
    </section>

    <Panel className="border-[var(--sf-protocol-accent-border)] bg-[var(--sf-protocol-accent-soft)]">
      <div className="flex items-start gap-3 px-4 py-3 text-xs text-sf-text-muted">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-[var(--sf-protocol-accent)]" aria-hidden="true" />
        <p className="leading-5">
          Static frontend preview. These values can be produced by an Express receiver using token authentication, Node crypto, JSON validation and timestamps; ingestion, persistence and alert evaluation are not connected yet.
        </p>
      </div>
    </Panel>
  </section>
);

export default WebhookEventsMonitor;
