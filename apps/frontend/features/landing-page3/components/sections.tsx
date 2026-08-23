"use client";

import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import {
  Activity,
  ArrowRight,
  BarChart3,
  BellRing,
  Boxes,
  Check,
  ChevronDown,
  CircleCheck,
  Cloud,
  Code2,
  Database,
  FileClock,
  Fingerprint,
  Gauge,
  GitBranch,
  Globe2,
  HeartPulse,
  KeyRound,
  Layers3,
  LineChart,
  LockKeyhole,
  Mail,
  Map,
  Network,
  RadioTower,
  Route,
  Server,
  ServerCog,
  ShieldCheck,
  TestTube2,
  TimerReset,
  Webhook,
  Workflow,
  Wrench,
  Zap,
} from "lucide-react";
import { BrandMark, Reveal, SectionHeading, StatusBadge } from "./primitives";
import styles from "../landing-page3.module.css";

export const SignalStrip = () => (
  <section className="border-b border-white/[.07] bg-[#090c11]">
    <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-white/[.07] px-5 sm:px-6 lg:grid-cols-4">
      {[
        ["V0—V18", "complete platform", "Detection through production SLOs"],
        ["7", "monitor modes", "HTTP, TLS, DNS, TCP, regions, VPS, events"],
        ["p50—p99.9", "latency evidence", "Readable percentiles, not averages alone"],
        ["Global", "probe network", "Quorum-aware regional health"],
      ].map(([value, label, note]) => (
        <div key={label} className="px-4 py-6 first:pl-0 even:pr-0 lg:px-7 lg:first:pl-0 lg:last:pr-0">
          <p className="text-xl font-semibold tracking-[-.04em] text-white/88">{value}</p>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-[.15em] text-white/34">{label}</p>
          <p className="mt-2 hidden text-[10px] leading-5 text-white/22 sm:block">{note}</p>
        </div>
      ))}
    </div>
  </section>
);

const liveCapabilities: Array<{
  icon: LucideIcon;
  title: string;
  copy: string;
  detail: string;
}> = [
  {
    icon: RadioTower,
    title: "Scheduled endpoint checks",
    copy: "Run authenticated HTTP or HTTPS checks automatically or on demand, then pause, resume, edit, or remove a monitor without losing its history.",
    detail: "Methods · bodies · status rules · timeouts",
  },
  {
    icon: LineChart,
    title: "Latency without the blind spots",
    copy: "See uptime windows, response-time trends, and backend-derived p50, p75, p90, p95, p99, and p99.9 values for each monitor.",
    detail: "24h · 7d · 30d · check history",
  },
  {
    icon: GitBranch,
    title: "State-aware incidents",
    copy: "Failure and recovery thresholds stop isolated blips becoming noise. Each incident keeps its HTTP evidence and a human-readable operational timeline.",
    detail: "Detected · investigating · monitoring · resolved",
  },
  {
    icon: BellRing,
    title: "A complete alert lifecycle",
    copy: "Downtime, recovery, and still-down reminders move through their own queue, with delivery history visible in the dashboard.",
    detail: "Email delivery · retries · history",
  },
  {
    icon: Map,
    title: "Global failure confirmation",
    copy: "Regional workers vote on health before an outage opens, separating origin failure from a local ISP or probe problem.",
    detail: "Quorum · degradation · regional latency",
  },
  {
    icon: ShieldCheck,
    title: "Production-safe monitoring",
    copy: "SSRF protection, redirect revalidation, rate limits, encrypted credentials, strict ownership, and versioned APIs protect every check path.",
    detail: "Security boundaries · OpenAPI · audit trail",
  },
];

const ExecutionPanel = () => (
  <div className="relative h-full overflow-hidden rounded-[16px] border border-white/[.09] bg-[#0b0e14] p-5 sm:p-6">
    <div className={`absolute inset-0 opacity-45 ${styles.microGrid}`} />
    <div className="relative">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[.17em] text-white/28">Execution path</p>
          <h3 className="mt-2 text-lg font-semibold tracking-[-.03em] text-white/82">Built beyond a timer loop.</h3>
        </div>
        <StatusBadge>running</StatusBadge>
      </div>

      <div className="mt-8 space-y-3">
        {[
          [TimerReset, "Scheduler", "Finds due monitors", "#ff8b70"],
          [Boxes, "Redis + BullMQ", "Buffers and retries work", "#a9bdff"],
          [Workflow, "Workers", "Run checks outside the API", "#85e7be"],
          [Database, "PostgreSQL", "Preserves results and state", "#d5b9ff"],
        ].map(([Icon, title, copy, tone], index) => {
          const StepIcon = Icon as LucideIcon;
          return (
            <div key={title as string} className="relative flex items-center gap-3 rounded-[10px] border border-white/[.07] bg-[#0e1219]/92 p-3.5">
              {index < 3 && <span className="absolute left-[29px] top-[calc(100%+1px)] h-3 w-px bg-white/10" />}
              <span className="flex size-8 shrink-0 items-center justify-center rounded-[8px] border border-white/[.07] bg-white/[.025]" style={{ color: tone as string }}><StepIcon className="size-3.5" /></span>
              <div className="min-w-0 flex-1"><p className="text-xs font-medium text-white/72">{title as string}</p><p className="mt-0.5 text-[9px] text-white/27">{copy as string}</p></div>
              <span className="font-mono text-[8px] text-white/20">0{index + 1}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between rounded-[9px] border border-[#71e0b1]/14 bg-[#71e0b1]/[.045] px-3 py-2.5 text-[9px]">
        <span className="flex items-center gap-2 text-white/40"><Activity className="size-3 text-[#71e0b1]" />Live browser updates</span>
        <span className="font-mono text-[#71e0b1]/70">SSE connected</span>
      </div>
    </div>
  </div>
);

export const ProductSection = () => (
  <section id="product" className="border-b border-white/[.07] py-24 sm:py-32">
    <div className="mx-auto max-w-7xl px-5 sm:px-6">
      <SectionHeading
        eyebrow="Complete product"
        title={<>The entire reliability loop,<br />in one operating system.</>}
        copy="StatusForge connects global signal collection, long-term evidence, percentile analytics, incident state, multi-channel response, public communication, and platform observability without forcing operators across disconnected tools."
      />

      <div className="mt-14 grid gap-4 lg:grid-cols-[1.25fr_.75fr]">
        <div className="grid gap-3 sm:grid-cols-2">
          {liveCapabilities.map((feature, index) => (
            <Reveal key={feature.title} delay={index * 0.05} className="h-full">
              <article className="group flex h-full flex-col rounded-[16px] border border-white/[.08] bg-white/[.018] p-5 transition-colors hover:border-white/[.14] hover:bg-white/[.028] sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <span className="flex size-10 items-center justify-center rounded-[10px] border border-white/[.08] bg-[#0d1117] text-[#ff8b70]"><feature.icon className="size-4" /></span>
                  <StatusBadge>live</StatusBadge>
                </div>
                <h3 className="mt-8 text-base font-semibold tracking-[-.025em] text-white/82">{feature.title}</h3>
                <p className="mt-3 flex-1 text-xs leading-6 text-white/38">{feature.copy}</p>
                <p className="mt-6 border-t border-white/[.07] pt-4 font-mono text-[8px] uppercase tracking-[.11em] text-white/22">{feature.detail}</p>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.12}><ExecutionPanel /></Reveal>
      </div>
    </div>
  </section>
);

type MonitorState = "live";
const monitorTypes: Array<{
  icon: LucideIcon;
  title: string;
  state: MonitorState;
  label: string;
  copy: string;
  signals: string[];
}> = [
  { icon: Globe2, title: "HTTP / HTTPS", state: "live", label: "Live", copy: "Availability, response codes, authenticated requests, timing phases, methods, bodies, content rules, and failure thresholds.", signals: ["Uptime", "Latency", "Content", "Auth"] },
  { icon: ShieldCheck, title: "TLS intelligence", state: "live", label: "Live", copy: "Certificate chain, hostname, expiry, ciphers, key strength, revocation, CT, CAA, security grade, and renewal tracking.", signals: ["Handshake", "Chain", "Revocation", "Grade"] },
  { icon: Route, title: "DNS", state: "live", label: "Live", copy: "Record resolution, answer snapshots, authoritative response timing, propagation differences, drift detection, and change alerts.", signals: ["Answers", "Resolution", "Propagation", "Change"] },
  { icon: Network, title: "TCP port", state: "live", label: "Live", copy: "Socket reachability, connect timing, timeout behavior, service-port evidence, and regional connection consistency.", signals: ["Reachability", "Connect", "Timeout", "Regions"] },
  { icon: Map, title: "Multi-region", state: "live", label: "Global", copy: "Independent regional workers, quorum-aware health, partial outages, route visibility, latency spread, and probe consensus.", signals: ["Regions", "Quorum", "Spread", "Routes"] },
  { icon: Server, title: "VPS telemetry", state: "live", label: "Agent", copy: "Agent health, CPU, memory, disk, load, network, processes, uptime, package state, and sustained resource alerts.", signals: ["Host", "Agent", "Resources", "Processes"] },
  { icon: Webhook, title: "Webhook events", state: "live", label: "Live", copy: "Inbound event health, delivery gaps, signature validity, payload schema, event-type coverage, and volume anomalies.", signals: ["Events", "Validity", "Delivery", "Volume"] },
];

const platformWorkspaces = [
  [BarChart3, "Analytics and SLOs", "Cross-monitor percentiles, availability trends, error-budget burn, regional comparisons, incident causes, and exportable reports."],
  [Boxes, "Integration control center", "Email, Slack, Discord, PagerDuty, signed webhooks, delivery testing, routing rules, and per-channel notification history."],
  [Wrench, "Operational settings", "Account security, monitor defaults, probe regions, maintenance windows, notification noise control, API keys, and status-page configuration."],
  [Gauge, "Request-phase diagnostics", "DNS lookup, TCP connect, TLS handshake, TTFB, response download, total duration, and percentile distributions for every phase."],
  [Globe2, "Public status communication", "Custom domains, selected components, incident updates, maintenance banners, subscribers, screenshots, and historical availability."],
  [FileClock, "Reports and evidence", "CSV exports, S3-backed artifacts, presigned downloads, immutable activity history, and retained check-level evidence."],
];

export const MonitoringSection = () => (
  <section id="monitoring" className="relative overflow-hidden border-b border-white/[.07] bg-[#090c12] py-24 sm:py-32">
    <div className="pointer-events-none absolute right-[-20%] top-0 size-[700px] rounded-full bg-[#526fff]/[.07] blur-[150px]" />
    <div className="relative mx-auto max-w-7xl px-5 sm:px-6">
      <SectionHeading
        eyebrow="Monitoring surface"
        title={<>One operational language.<br /><span className="text-white/28">Different kinds of failure.</span></>}
        copy="Every monitor shares one navigation, incident model, percentile language, and alert workflow while exposing the protocol-specific evidence engineers need to isolate the failure quickly."
      />

      <div className="mt-14 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {monitorTypes.map((monitor, index) => (
          <Reveal key={monitor.title} delay={(index % 3) * 0.045} className={index === 0 ? "lg:col-span-2" : ""}>
            <article className="h-full rounded-[14px] border border-white/[.08] bg-[#0b0e14]/90 p-5">
              <div className="flex items-center justify-between gap-4">
                <span className="flex size-9 items-center justify-center rounded-[9px] border border-white/[.07] bg-white/[.025] text-[#ff8b70]"><monitor.icon className="size-4" /></span>
                <StatusBadge tone={monitor.state}>{monitor.label}</StatusBadge>
              </div>
              <h3 className="mt-6 text-base font-semibold tracking-[-.025em] text-white/80">{monitor.title}</h3>
              <p className="mt-2 min-h-12 text-[11px] leading-5 text-white/34">{monitor.copy}</p>
              <div className="mt-5 flex flex-wrap gap-1.5 border-t border-white/[.07] pt-4">
                {monitor.signals.map((signal) => <span key={signal} className="rounded-[5px] bg-white/[.035] px-2 py-1 text-[8px] text-white/28">{signal}</span>)}
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      <div className="mt-16 border-t border-white/[.08] pt-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-[10px] font-semibold uppercase tracking-[.2em] text-[#c7a8ff]">Connected workspaces</p><h3 className="mt-3 text-2xl font-semibold tracking-[-.04em] text-white/82">From raw signal to operational decision.</h3></div>
          <p className="max-w-md text-xs leading-6 text-white/32">The product connects monitoring data to the pages where an operator investigates, communicates, configures policy, and proves reliability.</p>
        </div>
        <div className="mt-8 grid gap-px overflow-hidden rounded-[14px] border border-white/[.08] bg-white/[.08] sm:grid-cols-2">
          {platformWorkspaces.map(([Icon, title, copy]) => {
            const LabIcon = Icon as LucideIcon;
            return <div key={title as string} className="bg-[#0b0e14] p-5 sm:p-6"><div className="flex items-start gap-3"><LabIcon className="mt-0.5 size-4 shrink-0 text-[#c7a8ff]" /><div><p className="text-sm font-medium text-white/72">{title as string}</p><p className="mt-2 text-[10px] leading-5 text-white/30">{copy as string}</p></div></div></div>;
          })}
        </div>
      </div>
    </div>
  </section>
);

const incidentSteps = [
  ["01", "Failure observed", "The worker stores the check result and its concrete status code or connection error.", "#ff8b70"],
  ["02", "Threshold confirmed", "Consecutive failures qualify the transition, preventing one noisy sample from opening an incident.", "#ffb36b"],
  ["03", "Incident opened", "The state machine creates one durable incident and deduplicates repeated DOWN results.", "#a9bdff"],
  ["04", "Alert delivered", "The alert worker sends email independently and preserves delivery history for review.", "#d5b9ff"],
  ["05", "Recovery verified", "Consecutive successes resolve the incident, calculate duration, and trigger recovery communication.", "#85e7be"],
];

export const IncidentSection = () => (
  <section className="border-b border-white/[.07] py-24 sm:py-32">
    <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-6 lg:grid-cols-[.78fr_1.22fr] lg:items-start">
      <div className="lg:sticky lg:top-28">
        <SectionHeading
          eyebrow="Incident intelligence"
          title={<>A failure becomes a story you can act on.</>}
          copy="StatusForge treats incidents as state transitions, not a stream of red dots. Evidence, operational notes, alert delivery, and recovery stay attached to one timeline."
        />
        <div className="mt-8 grid grid-cols-3 gap-px overflow-hidden rounded-[12px] border border-white/[.08] bg-white/[.08]">
          {[["1", "open incident"], ["8m", "mean recovery"], ["3", "updates"]].map(([value, label]) => <div key={label} className="bg-[#0a0d12] p-3 text-center"><p className="text-lg font-semibold text-white/80">{value}</p><p className="mt-1 text-[7px] uppercase tracking-[.11em] text-white/23">{label}</p></div>)}
        </div>
      </div>

      <div className="relative rounded-[16px] border border-white/[.08] bg-[#0a0d12] p-5 sm:p-7">
        <div className="flex items-center justify-between border-b border-white/[.07] pb-5">
          <div><div className="flex items-center gap-2"><span className="size-2 rounded-full bg-[#71e0b1]" /><p className="text-sm font-semibold text-white/78">Checkout API</p></div><p className="mt-1.5 font-mono text-[8px] text-white/22">INC-2048 · api.statusforge.dev/checkout</p></div>
          <StatusBadge>resolved</StatusBadge>
        </div>
        <ol className="mt-7">
          {incidentSteps.map(([number, title, copy, tone], index) => (
            <Reveal key={title} delay={index * 0.04}>
              <li className="relative grid grid-cols-[36px_1fr] gap-4 pb-7 last:pb-0">
                {index < incidentSteps.length - 1 && <span className="absolute bottom-0 left-[17px] top-9 w-px bg-white/[.08]" />}
                <span className="relative z-10 flex size-9 items-center justify-center rounded-full border border-white/[.09] bg-[#0d1117] font-mono text-[8px]" style={{ color: tone }}>{number}</span>
                <div className="pt-1"><div className="flex items-center justify-between gap-3"><p className="text-xs font-medium text-white/70">{title}</p><span className="font-mono text-[8px] text-white/18">12:{18 + index * 2}</span></div><p className="mt-2 max-w-xl text-[10px] leading-5 text-white/30">{copy}</p></div>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </div>
  </section>
);

const regions = [
  ["US East", "Ashburn", "86ms", "99.99%"],
  ["US West", "Portland", "124ms", "99.98%"],
  ["EU West", "Dublin", "97ms", "100.00%"],
  ["EU Central", "Frankfurt", "108ms", "99.99%"],
  ["AP South", "Mumbai", "181ms", "99.97%"],
  ["SA East", "São Paulo", "218ms", "99.96%"],
];

const operationsDetail: Array<{ icon: LucideIcon; title: string; copy: string; items: string[]; tone: string }> = [
  { icon: Globe2, title: "Status communication", copy: "Turn internal incident state into a clear customer narrative without exposing private monitor data.", items: ["Custom domains", "Components", "Subscribers", "Maintenance", "Screenshots"], tone: "#71e0b1" },
  { icon: BellRing, title: "Alert routing", copy: "Route severity and lifecycle events through reliable, testable channels with delivery evidence.", items: ["Email", "Slack", "Discord", "PagerDuty", "HMAC webhooks"], tone: "#ffb36b" },
  { icon: LockKeyhole, title: "Security boundary", copy: "Protect both the operator account and the outbound monitoring surface from abuse.", items: ["SSRF defense", "DNS rebinding", "Encrypted secrets", "Rate limits", "Audit history"], tone: "#a9bdff" },
  { icon: HeartPulse, title: "Platform telemetry", copy: "Investigate StatusForge itself with correlated application and infrastructure signals.", items: ["Prometheus", "Grafana", "Loki", "OpenTelemetry", "Sentry"], tone: "#d5b9ff" },
];

export const OperationsSuiteSection = () => (
  <section className="border-b border-white/[.07] bg-[#090c12] py-24 sm:py-32">
    <div className="mx-auto max-w-7xl px-5 sm:px-6">
      <SectionHeading
        eyebrow="Global control plane"
        title={<>One place to operate<br />every reliability signal.</>}
        copy="Regional checks, confirmation policy, customer communication, provider delivery, security controls, and the health of StatusForge itself stay visible in one system."
      />

      <div className="mt-14 grid gap-4 lg:grid-cols-[1.22fr_.78fr]">
        <Reveal>
          <article className="overflow-hidden rounded-[16px] border border-white/[.08] bg-[#0b0e14]">
            <header className="flex items-center justify-between border-b border-white/[.07] px-5 py-4">
              <div className="flex items-center gap-3"><span className="flex size-9 items-center justify-center rounded-[9px] bg-[#71e0b1]/10 text-[#71e0b1]"><Map className="size-4" /></span><div><h3 className="text-sm font-semibold text-white/76">Probe network</h3><p className="mt-0.5 text-[9px] text-white/26">Every enabled region reports independently</p></div></div>
              <StatusBadge>6 of 6 reporting</StatusBadge>
            </header>
            <div className="grid grid-cols-[1.3fr_.8fr_.65fr] border-b border-white/[.06] px-5 py-2 text-[7px] font-semibold uppercase tracking-[.14em] text-white/20"><span>Region</span><span>p95</span><span className="text-right">30d uptime</span></div>
            {regions.map(([region, city, p95, uptime]) => (
              <div key={region} className="grid grid-cols-[1.3fr_.8fr_.65fr] items-center border-b border-white/[.055] px-5 py-3 last:border-0">
                <div className="flex items-center gap-2.5"><span className="size-1.5 rounded-full bg-[#71e0b1] shadow-[0_0_8px_rgba(113,224,177,.45)]" /><div><p className="text-[10px] font-medium text-white/62">{region}</p><p className="mt-0.5 text-[8px] text-white/22">{city}</p></div></div>
                <span className="font-mono text-[9px] text-white/40">{p95}</span>
                <span className="text-right font-mono text-[9px] text-white/50">{uptime}</span>
              </div>
            ))}
          </article>
        </Reveal>

        <Reveal delay={0.06}>
          <article className="flex h-full flex-col rounded-[16px] border border-white/[.08] bg-[#0b0e14] p-5 sm:p-6">
            <div className="flex items-center justify-between"><div><p className="text-[10px] font-semibold uppercase tracking-[.16em] text-white/25">Confirmation policy</p><h3 className="mt-2 text-lg font-semibold tracking-[-.03em] text-white/78">Noise stays local.</h3></div><ShieldCheck className="size-5 text-[#ff8b70]" /></div>
            <div className="mt-7 grid grid-cols-6 gap-2">{regions.map(([name]) => <div key={name} className="flex h-11 items-center justify-center rounded-[7px] border border-[#71e0b1]/17 bg-[#71e0b1]/[.055]"><Check className="size-3 text-[#71e0b1]" /></div>)}</div>
            <dl className="mt-7 divide-y divide-white/[.065] border-y border-white/[.065]">
              {[
                ["Incident quorum", "3 of 6 regions"],
                ["Regional degradation", "2× median latency"],
                ["Retries before failing", "3 attempts · 20s delay"],
                ["Global outage", "All reporting regions down"],
                ["Alert handoff", "Immediately after confirmation"],
              ].map(([label, value]) => <div key={label} className="flex items-center justify-between gap-4 py-3 text-[10px]"><dt className="text-white/28">{label}</dt><dd className="text-right font-medium text-white/60">{value}</dd></div>)}
            </dl>
            <p className="mt-auto pt-6 text-[9px] leading-5 text-white/24">Single-region anomalies remain searchable evidence. They escalate only when policy confirms customer impact.</p>
          </article>
        </Reveal>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {operationsDetail.map((item, index) => (
          <Reveal key={item.title} delay={(index % 4) * 0.04}>
            <article className="h-full rounded-[14px] border border-white/[.08] bg-[#0b0e14] p-5">
              <item.icon className="size-4" style={{ color: item.tone }} />
              <h3 className="mt-6 text-sm font-semibold text-white/72">{item.title}</h3>
              <p className="mt-2 min-h-16 text-[9px] leading-5 text-white/28">{item.copy}</p>
              <div className="mt-4 space-y-2 border-t border-white/[.06] pt-4">{item.items.map((value) => <p key={value} className="flex items-center gap-2 text-[8px] text-white/28"><Check className="size-2.5" style={{ color: item.tone }} />{value}</p>)}</div>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

const architectureLayers: Array<{ icon: LucideIcon; title: string; copy: string; items: string[]; phase: string }> = [
  { icon: RadioTower, title: "Detect", copy: "Protocol-aware checks produce useful evidence, not only a boolean.", items: ["HTTP", "TLS", "DNS", "TCP", "regional workers"], phase: "V0 · V7 · V12" },
  { icon: Workflow, title: "Process", copy: "Schedulers, Redis queues, workers, retries, and state transitions isolate failures.", items: ["BullMQ", "idempotency", "concurrency", "backoff"], phase: "V3 · V4 · V11" },
  { icon: Database, title: "Understand", copy: "History, percentiles, incidents, aggregates, caches, and exports turn checks into context.", items: ["PostgreSQL", "analytics", "retention", "S3 exports"], phase: "V1 · V6 · V8 · V11" },
  { icon: BellRing, title: "Respond", copy: "Lifecycle-aware delivery reaches the owner through the right channel with an audit trail.", items: ["email", "Slack", "Discord", "signed webhooks"], phase: "V5 · V13" },
  { icon: LockKeyhole, title: "Protect", copy: "Ownership, token lifecycle, SSRF defense, rate limits, and a versioned API define the boundary.", items: ["JWT", "SSRF", "Helmet", "OpenAPI"], phase: "V2 · V10" },
  { icon: HeartPulse, title: "Operate", copy: "Logs, traces, metrics, SLOs, tests, CI/CD, and runbooks make StatusForge observable itself.", items: ["Pino", "Sentry", "OTel", "Grafana", "runbooks"], phase: "V15 · V16 · V17 · V18" },
];

export const ArchitectureSection = () => (
  <section id="architecture" className="relative overflow-hidden border-b border-white/[.07] bg-[#090c12] py-24 sm:py-32">
    <div className={`pointer-events-none absolute inset-0 opacity-40 ${styles.architectureGrid}`} />
    <div className="relative mx-auto max-w-7xl px-5 sm:px-6">
      <SectionHeading
        eyebrow="Full system"
        title={<>From synthetic check to production practice.</>}
        copy="The completed V18 platform is not a pile of unrelated features. Each layer closes a specific gap between detecting a failure, coordinating response, communicating impact, and operating the monitoring system reliably in production."
        align="center"
      />
      <div className="mt-16 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {architectureLayers.map((layer, index) => (
          <Reveal key={layer.title} delay={(index % 3) * 0.05}>
            <article className="h-full rounded-[15px] border border-white/[.08] bg-[#0b0e14]/92 p-5 backdrop-blur sm:p-6">
              <div className="flex items-center justify-between"><span className="flex size-9 items-center justify-center rounded-[9px] border border-[#ff7759]/15 bg-[#ff7759]/[.06] text-[#ff8b70]"><layer.icon className="size-4" /></span><span className="font-mono text-[8px] text-white/19">{layer.phase}</span></div>
              <h3 className="mt-7 text-base font-semibold tracking-[-.025em] text-white/78">{layer.title}</h3>
              <p className="mt-2 text-[10px] leading-5 text-white/31">{layer.copy}</p>
              <div className="mt-5 flex flex-wrap gap-1.5">{layer.items.map((item) => <span key={item} className="rounded-[5px] border border-white/[.06] bg-white/[.02] px-2 py-1 text-[8px] text-white/24">{item}</span>)}</div>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

type PlatformTone = "live" | "cut";
const platformReleases: Array<{ version: string; title: string; copy: string; status: string; tone: PlatformTone; icon: LucideIcon }> = [
  { version: "V0", title: "URL checker", copy: "One-off HTTP checks with measured latency, normalized errors, and consistent UP or DOWN results.", status: "Shipped", tone: "live", icon: Code2 },
  { version: "V1", title: "Endpoint manager", copy: "Persistent monitors, full CRUD, manual execution, latest-state snapshots, and PostgreSQL check history.", status: "Shipped", tone: "live", icon: Database },
  { version: "V2", title: "Secure identity", copy: "Verified registration, JWT access and refresh rotation, logout revocation, ownership, and isolated monitor data.", status: "Shipped", tone: "live", icon: Fingerprint },
  { version: "V3", title: "Automatic monitoring", copy: "Due-time scheduling, pause and resume controls, error isolation, graceful shutdown, and predictable next runs.", status: "Shipped", tone: "live", icon: TimerReset },
  { version: "V4", title: "Distributed execution", copy: "Redis, BullMQ, dedicated API and TLS workers, concurrency, retries, job visibility, and failure handling.", status: "Shipped", tone: "live", icon: Boxes },
  { version: "V5", title: "Incident response", copy: "Threshold state machines, deduplicated incidents, down and recovery delivery, reminders, and notification history.", status: "Shipped", tone: "live", icon: Mail },
  { version: "V6", title: "Analytics and live UI", copy: "Operational dashboard, pagination, percentile charts, incident timelines, server filters, and SSE updates.", status: "Shipped", tone: "live", icon: BarChart3 },
  { version: "V7", title: "Protocol depth", copy: "Custom health rules, TLS intelligence, DNS snapshots, TCP reachability, encrypted credentials, and cursor logs.", status: "Shipped", tone: "live", icon: ShieldCheck },
  { version: "V8", title: "Public communication", copy: "Status pages, maintenance, subscribers, S3 exports, screenshots, avatars, and granular HTTP request phases.", status: "Shipped", tone: "live", icon: Globe2 },
  { version: "V9", title: "Teams and workspaces", copy: "Purposefully excluded so StatusForge stays fast and focused for a single accountable operator.", status: "Excluded by design", tone: "cut", icon: Layers3 },
  { version: "V10", title: "Security and API lifecycle", copy: "SSRF and rebinding defense, redirect checks, rate limits, Helmet, strict CORS, versioned APIs, and OpenAPI.", status: "Shipped", tone: "live", icon: LockKeyhole },
  { version: "V11", title: "Scale and performance", copy: "Purpose-built indexes, keyset pagination, retention, rollups, cached summaries, batching, and query analysis.", status: "Shipped", tone: "live", icon: Gauge },
  { version: "V12", title: "Multi-region monitoring", copy: "Regional workers, quorum aggregation, DEGRADED states, route evidence, partial-outage alerts, and latency spread.", status: "Shipped", tone: "live", icon: Map },
  { version: "V13", title: "Alert integrations", copy: "Slack, Discord, PagerDuty, HMAC-signed webhooks, routing policies, test delivery, retries, and audit logs.", status: "Shipped", tone: "live", icon: Webhook },
  { version: "V14", title: "Billing and plans", copy: "Purposefully excluded—monitoring depth is available without artificial plan gates or subscription administration.", status: "Excluded by design", tone: "cut", icon: KeyRound },
  { version: "V15", title: "Application observability", copy: "Structured Pino logs, correlation IDs, Sentry, dependency health, queue visibility, alerting, and activity history.", status: "Shipped", tone: "live", icon: Activity },
  { version: "V16", title: "Comprehensive testing", copy: "Service and route suites, isolated fixtures, mocked dependencies, security cases, coverage gates, and pull-request CI.", status: "Shipped", tone: "live", icon: TestTube2 },
  { version: "V17", title: "Production deployment", copy: "Multi-stage containers, CI/CD, managed PostgreSQL and Redis, automated migrations, rollback, and zero-downtime releases.", status: "Shipped", tone: "live", icon: Cloud },
  { version: "V18", title: "Monitoring the monitor", copy: "Prometheus, Grafana, Loki, OpenTelemetry, service SLOs, actionable alerts, runbooks, and dogfooded checks.", status: "Shipped", tone: "live", icon: ServerCog },
];

export const PlatformStackSection = () => (
  <section id="platform-stack" className="border-b border-white/[.07] py-24 sm:py-32">
    <div className="mx-auto max-w-7xl px-5 sm:px-6">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          eyebrow="The complete V18 platform"
          title={<>Eighteen releases.<br />One finished operating system.</>}
          copy="Every layer is deployed and connected—from the first URL check to global workers, public communication, hardened APIs, production deployment, and monitoring StatusForge with StatusForge. V9 and V14 remain intentionally excluded to preserve the solo-operator focus."
        />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[[CircleCheck, "17 shipped layers"], [RadioTower, "7 monitor modes"], [Map, "Global probes"], [HeartPulse, "Self-observed"]].map(([Icon, label]) => { const LegendIcon = Icon as LucideIcon; return <span key={label as string} className="flex items-center gap-2 rounded-[8px] border border-white/[.07] px-3 py-2 text-[9px] text-white/30"><LegendIcon className="size-3 text-[#ff8b70]" />{label as string}</span>; })}
        </div>
      </div>

      <div className="relative mt-16">
        <div className="absolute bottom-0 left-[19px] top-0 hidden w-px bg-gradient-to-b from-[#71e0b1]/50 via-[#88a7ff]/30 to-[#c69cff]/30 md:block" />
        <div className="grid gap-3 md:grid-cols-2 md:gap-x-8 lg:grid-cols-3">
          {platformReleases.map((item, index) => (
            <Reveal key={item.version} delay={(index % 3) * 0.035}>
              <article className={`relative h-full rounded-[13px] border p-4 sm:p-5 ${item.tone === "cut" ? "border-white/[.05] bg-white/[.01] opacity-60" : "border-white/[.08] bg-white/[.018]"}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3"><span className="flex size-9 items-center justify-center rounded-[9px] border border-white/[.07] bg-[#0b0e14] text-[#ff8b70]"><item.icon className="size-4" /></span><div><p className="font-mono text-[8px] font-semibold text-white/25">{item.version}</p><h3 className="mt-1 text-sm font-semibold tracking-[-.02em] text-white/75">{item.title}</h3></div></div>
                  <StatusBadge tone={item.tone}>{item.status}</StatusBadge>
                </div>
                <p className="mt-4 text-[10px] leading-5 text-white/29">{item.copy}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const questions = [
  ["What can StatusForge monitor?", "HTTP and authenticated API flows, TLS certificates, DNS answers, TCP ports, regional availability, VPS hosts through the StatusForge agent, and inbound webhook-event streams all share one incident and analytics model."],
  ["How does multi-region failure confirmation work?", "Each enabled region runs an independent check. StatusForge compares health, latency, content, certificates, DNS answers, and routes, then applies your quorum before declaring a global outage. A localized failure becomes a DEGRADED regional event instead."],
  ["What happens after an incident opens?", "StatusForge preserves the triggering evidence, publishes live updates, routes notifications through email, Slack, Discord, PagerDuty, or signed webhooks, tracks acknowledgements and reminders, and resolves only after the configured recovery threshold passes."],
  ["How is StatusForge secured?", "Outbound checks enforce SSRF and DNS-rebinding protection across redirects. The platform also applies encrypted monitor credentials, ownership isolation, access and refresh-token rotation, route-specific rate limits, strict CORS, security headers, HMAC signatures, and immutable activity records."],
  ["Can customers see service health?", "Yes. Public status pages support custom domains, selected components, live incidents, maintenance announcements, subscriptions, historical availability, screenshots, and downloadable reports without exposing private operational data."],
  ["How is the monitoring platform itself operated?", "StatusForge ships as containerized API, scheduler, and worker processes with CI/CD, managed PostgreSQL and Redis, health and readiness checks, Pino and Loki logs, Sentry errors, Prometheus metrics, OpenTelemetry traces, Grafana dashboards, SLO alerts, rollback plans, and tested runbooks."],
];

export const FaqAndCta = () => {
  const [open, setOpen] = useState(0);

  return (
    <>
      <section id="faq" className="border-b border-white/[.07] bg-[#090c12] py-24 sm:py-32">
        <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-6 lg:grid-cols-[.72fr_1.28fr]">
          <SectionHeading eyebrow="Platform questions" title={<>Built for the whole incident lifecycle.</>} copy="How global monitoring, response, public communication, security, and production operations work together inside StatusForge." />
          <div className="border-t border-white/[.09]">
            {questions.map(([question, answer], index) => {
              const active = index === open;
              return (
                <div key={question} className="border-b border-white/[.09]">
                  <button type="button" aria-expanded={active} onClick={() => setOpen(active ? -1 : index)} className="flex w-full items-center justify-between gap-6 py-5 text-left">
                    <span className="text-sm font-medium text-white/66">{question}</span>
                    <ChevronDown className={`size-4 shrink-0 text-white/25 transition-transform ${active ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {active && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden"><p className="max-w-2xl pb-5 text-xs leading-6 text-white/35">{answer}</p></motion.div>}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden py-28 sm:py-40">
        <div className="absolute inset-0 -z-20 bg-[#07090d]" />
        <div className="absolute left-1/2 top-1/2 -z-10 h-[420px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ff6848]/10 blur-[130px]" />
        <div className={`absolute inset-0 -z-10 opacity-45 ${styles.heroGrid}`} />
        <Reveal className="mx-auto max-w-4xl px-5 text-center sm:px-6">
          <span className="mx-auto flex size-12 items-center justify-center rounded-[14px] border border-[#ff7759]/25 bg-[#ff7759]/10 text-[#ff8b70]"><Zap className="size-5" /></span>
          <h2 className="mt-7 text-balance text-4xl font-semibold leading-[1.02] tracking-[-.055em] text-white sm:text-6xl">Start with the endpoint<br />that cannot fail silently.</h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/42">Build the monitoring habit now. Let StatusForge grow with the depth, resilience, and operational discipline your systems earn.</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/register" className="group flex h-11 items-center gap-2 rounded-[9px] bg-white px-5 text-sm font-semibold text-[#090b10] transition-transform hover:-translate-y-0.5">Create your account <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" /></Link>
            <Link href="/login" className="flex h-11 items-center rounded-[9px] border border-white/12 bg-white/[.03] px-5 text-sm font-medium text-white/66 hover:bg-white/[.06] hover:text-white">Open the dashboard</Link>
          </div>
          <div className="mt-7 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[10px] text-white/28">{["Global probe network", "No artificial plan gates", "Production observability included"].map((item) => <span key={item} className="flex items-center gap-1.5"><Check className="size-3 text-[#71e0b1]" />{item}</span>)}</div>
        </Reveal>
      </section>
    </>
  );
};

const footerLinks = [
  ["Product", "#product"], ["Monitoring", "#monitoring"], ["Architecture", "#architecture"], ["Platform stack", "#platform-stack"], ["FAQ", "#faq"], ["Dashboard", "/dashboard/overview"],
];

export const Footer = () => (
  <footer className="border-t border-white/[.07] bg-[#05070a] px-5 py-12 sm:px-6">
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-col gap-8 border-b border-white/[.07] pb-10 md:flex-row md:items-start md:justify-between">
        <div><BrandMark /><p className="mt-4 max-w-sm text-xs leading-6 text-white/28">Global monitoring, incident intelligence, public communication, and production observability for operators who need every failure to be visible, explainable, and recoverable.</p></div>
        <div className="flex max-w-xl flex-wrap gap-x-6 gap-y-3">{footerLinks.map(([label, href]) => <Link key={label} href={href} className="text-[10px] font-medium text-white/30 hover:text-white/70">{label}</Link>)}</div>
      </div>
      <div className="flex flex-col gap-3 pt-6 text-[9px] text-white/16 sm:flex-row sm:items-center sm:justify-between"><span>© 2026 StatusForge</span><span>Global monitoring · incident response · production reliability</span></div>
    </div>
  </footer>
);
