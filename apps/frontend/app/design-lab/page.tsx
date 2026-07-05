"use client";

/**
 * DESIGN PROTOTYPE — isolated comparison route (not roadmap work).
 * Open this next to /dashboard to compare. Self-contained: mock data, no imports
 * from real components, forced dark via the wrapper. Demonstrates 6 changes:
 *   ① layout density   ② unified pager      ③ fewer borders / elevation
 *   ④ status as hero    ⑤ color semantics    ⑥ quiet sidebar
 */

import { useState } from "react";
import {
  Activity,
  Bell,
  LayoutDashboard,
  Plug,
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";

/* ───────────────────────── mock data ───────────────────────── */

type State = "up" | "degraded" | "down";

const monitors: {
  name: string;
  url: string;
  state: State;
  uptime: number;
  response: number | null;
  trend: number[];
}[] = [
  { name: "Stripe API", url: "api.stripe.com", state: "up", uptime: 99.98, response: 142, trend: [140, 138, 150, 142, 135, 148, 141, 139, 144, 142] },
  { name: "GitHub API", url: "api.github.com", state: "up", uptime: 99.95, response: 88, trend: [82, 90, 86, 88, 91, 84, 87, 89, 85, 88] },
  { name: "Cloudflare", url: "cloudflare.com", state: "degraded", uptime: 98.1, response: 310, trend: [120, 140, 180, 220, 260, 300, 290, 320, 305, 310] },
  { name: "Zoom API", url: "api.zoom.us", state: "down", uptime: 91.2, response: null, trend: [180, 175, 190, 600, 0, 0, 0, 0, 0, 0] },
  { name: "Postgres (primary)", url: "db.internal", state: "up", uptime: 100, response: 54, trend: [50, 56, 52, 54, 53, 55, 51, 54, 52, 54] },
  { name: "SendGrid", url: "api.sendgrid.com", state: "up", uptime: 99.8, response: 120, trend: [118, 122, 119, 130, 121, 117, 124, 120, 119, 120] },
];

const alerts: {
  id: number;
  event: "down" | "recovery" | "reminder";
  monitor: string;
  subject: string;
  delivery: "Delivered" | "Failed";
  sent: string;
}[] = [
  { id: 1, event: "recovery", monitor: "Zoom API", subject: "Zoom API is recovered", delivery: "Delivered", sent: "19min ago" },
  { id: 2, event: "reminder", monitor: "Zoom API", subject: "Zoom API is still down", delivery: "Failed", sent: "39min ago" },
  { id: 3, event: "reminder", monitor: "Zoom API", subject: "Zoom API is still down", delivery: "Delivered", sent: "39min ago" },
  { id: 4, event: "down", monitor: "Stripe API", subject: "Stripe API is down", delivery: "Delivered", sent: "2h ago" },
  { id: 5, event: "recovery", monitor: "GitHub API", subject: "GitHub API is recovered", delivery: "Delivered", sent: "5h ago" },
];

/* ───────────────────────── helpers ───────────────────────── */

const stateMeta: Record<
  State,
  { label: string; text: string; accent: string; dot: string }
> = {
  up: { label: "Operational", text: "text-sf-green", accent: "border-l-sf-green", dot: "bg-sf-green" },
  degraded: { label: "Degraded", text: "text-sf-amber", accent: "border-l-sf-amber", dot: "bg-sf-amber" },
  down: { label: "Down", text: "text-sf-red", accent: "border-l-sf-red", dot: "bg-sf-red" },
};

// ④ + ⑤ : ONE inline sparkline, colored by state via currentColor.
function Sparkline({ data, state }: { data: number[]; state: State }) {
  const w = 96;
  const h = 26;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * (h - 4) - 2;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg width={w} height={h} className={stateMeta[state].text}>
      <polyline
        points={pts}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Small chip that labels which of the 6 changes a section demonstrates.
function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-sf-blue/30 bg-sf-blue-bg px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em] text-sf-blue">
      {children}
    </span>
  );
}

/* ② : the single unified pager, reused everywhere. */
function Pager({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (p: number) => void;
}) {
  const go = (p: number) => onChange(Math.min(Math.max(p, 1), totalPages));
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-sf-text-muted">
        Page <span className="text-sf-text-sub">{page}</span> of {totalPages}
      </span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => go(page - 1)}
          disabled={page === 1}
          aria-label="Previous page"
          className="flex h-7 w-7 items-center justify-center rounded-sf text-sf-text-sub transition-colors hover:bg-sf-border-faint hover:text-sf-text disabled:pointer-events-none disabled:opacity-40"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>
        {Array.from({ length: totalPages }, (_, i) => {
          const p = i + 1;
          const ellipsisBefore = p === page - 2 && page > 4;
          const ellipsisAfter = p === page + 2 && page < totalPages - 3;
          const visible = p === 1 || p === totalPages || Math.abs(p - page) <= 1;
          if (ellipsisBefore || ellipsisAfter)
            return (
              <span key={`e-${p}`} className="px-0.5 text-[12px] text-sf-text-muted">
                …
              </span>
            );
          if (!visible) return null;
          const active = p === page;
          return (
            <button
              key={p}
              type="button"
              onClick={() => go(p)}
              aria-current={active ? "page" : undefined}
              className={`flex h-7 min-w-7 items-center justify-center rounded-sf px-2 font-mono text-[12px] tabular-nums transition-colors ${
                active
                  ? "bg-sf-blue-bg text-sf-blue"
                  : "text-sf-text-sub hover:bg-sf-border-faint hover:text-sf-text"
              }`}
            >
              {p}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => go(page + 1)}
          disabled={page === totalPages}
          aria-label="Next page"
          className="flex h-7 w-7 items-center justify-center rounded-sf text-sf-text-sub transition-colors hover:bg-sf-border-faint hover:text-sf-text disabled:pointer-events-none disabled:opacity-40"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

/* ───────────────────────── sidebar (⑥) ───────────────────────── */

function Sidebar() {
  const nav = [
    { icon: LayoutDashboard, label: "Overview", active: false },
    { icon: Activity, label: "Monitors", active: false },
    { icon: Bell, label: "Alerts", active: false },
    { icon: Plug, label: "Integrations", active: true },
  ];
  return (
    <aside className="flex w-56 shrink-0 flex-col gap-1 bg-sf-surface/60 px-3 py-4">
      <div className="mb-4 flex items-center gap-2 px-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-sf bg-sf-logo-bg text-[12px] font-bold text-sf-logo-stroke">
          S
        </div>
        <span className="text-[14px] font-semibold tracking-sf-tight">UptimeSentinel</span>
      </div>

      {nav.map((n) => (
        <button
          key={n.label}
          className={`flex items-center gap-2.5 rounded-sf px-2.5 py-1.5 text-[13px] transition-colors ${
            n.active
              ? "bg-sf-border-faint font-medium text-sf-text"
              : "text-sf-text-sub hover:bg-sf-border-faint/60 hover:text-sf-text"
          }`}
        >
          <n.icon className="h-4 w-4" />
          {n.label}
        </button>
      ))}

      {/* ⑥ : coming-soon collapsed to one muted line instead of 3 dead rows */}
      <button className="mt-2 flex items-center gap-1.5 px-2.5 py-1.5 text-[12px] text-sf-text-muted transition-colors hover:text-sf-text-sub">
        <ChevronDown className="h-3.5 w-3.5" />
        Workspace
        <span className="ml-auto rounded-full bg-sf-border-faint px-1.5 py-0.5 text-[10px]">
          Soon
        </span>
      </button>

      <div className="mt-auto flex items-center gap-2 px-2 pt-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-sf-border text-[11px] font-semibold">
          DW
        </div>
        <div className="leading-tight">
          <p className="text-[12px] font-medium">Dana Whitman</p>
          <p className="text-[11px] text-sf-text-muted">Owner</p>
        </div>
      </div>
    </aside>
  );
}

/* ───────────────────────── status strip (④) ───────────────────────── */

function StatusStrip() {
  const up = monitors.filter((m) => m.state === "up").length;
  const degraded = monitors.filter((m) => m.state === "degraded").length;
  const down = monitors.filter((m) => m.state === "down").length;
  const cards = [
    { label: "Operational", value: up, text: "text-sf-green", dot: "bg-sf-green" },
    { label: "Degraded", value: degraded, text: "text-sf-amber", dot: "bg-sf-amber" },
    { label: "Down", value: down, text: "text-sf-red", dot: "bg-sf-red" },
    { label: "Avg uptime", value: "98.8%", text: "text-sf-text", dot: "" },
  ];
  return (
    <div className="grid grid-cols-4 gap-3">
      {cards.map((c) => (
        <div key={c.label} className="rounded-sf-card bg-sf-surface p-3.5 shadow-sf-card">
          <div className="flex items-center gap-1.5">
            {c.dot && <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />}
            <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-sf-text-muted">
              {c.label}
            </span>
          </div>
          <p className={`mt-1.5 text-[22px] font-semibold tabular-nums ${c.text}`}>
            {c.value}
          </p>
        </div>
      ))}
    </div>
  );
}

/* ───────────────────────── monitors table (①③④⑤) ───────────────────────── */

function MonitorsTable() {
  const [page, setPage] = useState(1);
  return (
    <div className="rounded-sf-card bg-sf-surface shadow-sf-card">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-[14px] font-semibold">Monitors</span>
          <span className="rounded-full bg-sf-border-faint px-1.5 py-0.5 font-mono text-[11px] text-sf-text-sub">
            {monitors.length}
          </span>
        </div>
        <div className="flex items-center gap-2 rounded-sf bg-sf-bg px-3 py-1.5 text-sf-text-muted">
          <Search className="h-3.5 w-3.5" />
          <span className="text-[13px]">Filter monitors</span>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_90px_110px_120px] gap-4 px-4 pb-2 font-mono text-[10px] uppercase tracking-[0.08em] text-sf-text-muted">
        <span>Monitor</span>
        <span className="text-center">Uptime</span>
        <span className="text-center">Response</span>
        <span>Status</span>
      </div>

      <div>
        {monitors.map((m) => {
          const meta = stateMeta[m.state];
          return (
            <div
              key={m.name}
              className={`grid grid-cols-[1fr_90px_110px_120px] items-center gap-4 border-l-2 px-4 py-2.5 transition-colors hover:bg-sf-border-faint/40 ${meta.accent}`}
            >
              <div className="min-w-0">
                <p className="truncate text-[13px] font-medium">{m.name}</p>
                <p className="truncate text-[11px] text-sf-text-muted">{m.url}</p>
              </div>
              <span className="text-center text-[13px] tabular-nums text-sf-text-sub">
                {m.uptime}%
              </span>
              <div className="flex items-center justify-center">
                <Sparkline data={m.trend} state={m.state} />
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
                <span className={`text-[12px] font-medium ${meta.text}`}>
                  {meta.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="px-4 py-2.5">
        <Pager page={page} totalPages={10} onChange={setPage} />
      </div>
    </div>
  );
}

/* ───────────────────────── recent alerts (②③⑤) ───────────────────────── */

const eventBadge: Record<string, string> = {
  down: "border-sf-red/30 bg-sf-red-bg text-sf-red",
  recovery: "border-sf-green/30 bg-sf-green-bg text-sf-green",
  reminder: "border-sf-amber/30 bg-sf-amber/10 text-sf-amber",
};

function RecentAlerts() {
  const [page, setPage] = useState(1);
  return (
    <div className="rounded-sf-card bg-sf-surface shadow-sf-card">
      <div className="flex items-start justify-between px-4 py-3">
        <div>
          <h2 className="text-[14px] font-semibold">Recent alert emails</h2>
          <p className="text-[12px] text-sf-text-sub">Last 7 days</p>
        </div>
        <button className="flex items-center gap-1.5 rounded-sf px-2.5 py-1.5 text-[13px] font-medium text-sf-text-sub transition-colors hover:bg-sf-border-faint hover:text-sf-text">
          <ExternalLink className="h-3.5 w-3.5" />
          View all
        </button>
      </div>

      <div className="max-h-[300px] overflow-y-auto px-2">
        {alerts.map((a) => (
          <div
            key={a.id}
            className="flex items-center gap-3 rounded-sf px-2 py-2.5 transition-colors hover:bg-sf-border-faint/40"
          >
            <span
              className={`w-fit shrink-0 rounded-md border px-2 py-0.5 text-[11px] font-semibold ${eventBadge[a.event]}`}
            >
              {a.event}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium">{a.subject}</p>
              <p className="truncate text-[11px] text-sf-text-muted">{a.monitor}</p>
            </div>
            <span className="shrink-0 text-[12px] text-sf-text-muted">{a.sent}</span>
            {/* ⑤ : Failed delivery is amber (operational noise), not red (outage) */}
            <div className="flex w-20 shrink-0 items-center justify-end gap-1">
              {a.delivery === "Delivered" ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5 text-sf-green" />
                  <span className="text-[12px] font-medium text-sf-green">Sent</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-3.5 w-3.5 text-sf-amber" />
                  <span className="text-[12px] font-medium text-sf-amber">Failed</span>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 py-2.5">
        <Pager page={page} totalPages={10} onChange={setPage} />
      </div>
    </div>
  );
}

/* ───────────────────────── page ───────────────────────── */

export default function DesignLab() {
  return (
    <div className="dark min-h-screen bg-sf-bg font-sans text-sf-text">
      <div className="flex min-h-screen">
        <Sidebar />

        <main className="flex-1 overflow-y-auto">
          {/* legend */}
          <div className="border-b border-sf-border bg-sf-surface/40 px-6 py-3">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-sf-text-sub">
              <span className="font-mono uppercase tracking-[0.08em] text-sf-text-muted">
                Design prototype — compare with /dashboard
              </span>
              <Tag>① density</Tag>
              <Tag>② unified pager</Tag>
              <Tag>③ elevation, not borders</Tag>
              <Tag>④ status as hero</Tag>
              <Tag>⑤ color semantics</Tag>
              <Tag>⑥ quiet sidebar</Tag>
            </div>
          </div>

          <div className="space-y-5 px-6 py-5">
            {/* header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-[20px] font-semibold tracking-sf-tight">Overview</h1>
                <p className="text-[13px] text-sf-text-sub">
                  All systems — 6 monitors, 1 incident open
                </p>
              </div>
              <button className="flex items-center gap-1.5 rounded-sf bg-sf-text px-3 py-1.5 text-[13px] font-medium text-sf-bg transition-opacity hover:opacity-90">
                <Plus className="h-3.5 w-3.5" />
                New monitor
              </button>
            </div>

            <StatusStrip />

            {/* ① two-column: live data left, recent activity right — no long scroll */}
            <div className="grid grid-cols-[1.6fr_1fr] gap-5">
              <MonitorsTable />
              <RecentAlerts />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
