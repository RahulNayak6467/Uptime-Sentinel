import {
  Activity,
  Bell,
  ChartNoAxesCombined,
  CircleGauge,
  Clock3,
  Globe2,
  LayoutDashboard,
  Plus,
  Radio,
  Settings2,
} from "lucide-react";
import AnimatedResponseChart from "./animated-response-chart";

const metrics = [
  ["Overall uptime", "99.97%", "30 days", "text-emerald-300"],
  ["Total monitors", "12", "tracked", "text-white"],
  ["Up", "11", "operational", "text-white"],
  ["Down", "1", "failing", "text-red-300"],
  ["Paused", "0", "muted", "text-white"],
  ["Avg response", "184ms", "all monitors", "text-white"],
  ["Total checks", "8,429", "today", "text-white"],
];

const monitors = [
  ["Checkout API", "api.uptimesentinel.dev/checkout", "99.98%", "146ms", "200", "30s", "24s", "UP"],
  ["Auth service", "auth.uptimesentinel.dev/verify", "99.95%", "218ms", "200", "60s", "41s", "UP"],
  ["Payments API", "pay.uptimesentinel.dev/v2", "97.42%", "—", "503", "30s", "12s", "DOWN"],
  ["Public status", "status.uptimesentinel.dev", "100%", "91ms", "200", "60s", "53s", "UP"],
];

const UptimeSentinelOverviewPreview = () => {
  return (
    <div className="overflow-hidden rounded-t-[20px] border border-white/[0.09] bg-[#0d0d0d]">
      <div className="flex h-10 items-center justify-between border-b border-white/[0.08] px-4">
        <div className="flex gap-1.5">
          <span className="size-2 rounded-full bg-white/15" />
          <span className="size-2 rounded-full bg-white/10" />
          <span className="size-2 rounded-full bg-white/[0.06]" />
        </div>
        <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-white/25">
          app.uptimesentinel.dev/dashboard
        </span>
        <span className="flex items-center gap-1.5 text-[9px] text-emerald-300/70">
          <Radio className="size-2.5" /> Live
        </span>
      </div>

      <div className="grid min-h-[520px] grid-cols-1 sm:grid-cols-[170px_1fr]">
        <aside className="hidden border-r border-white/[0.08] bg-[#111] p-3 sm:flex sm:flex-col">
          <div className="flex items-center gap-2 px-1">
            <span className="flex size-7 items-center justify-center rounded-md bg-white text-black">
              <Activity className="size-3.5" />
            </span>
            <div>
              <p className="text-[10px] font-bold text-white/90">UptimeSentinel</p>
              <p className="text-[7px] uppercase tracking-[0.14em] text-white/25">Uptime</p>
            </div>
          </div>

          <div className="mt-4 rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-1.5 text-[9px] font-semibold text-white/65">
            Acme production
          </div>

          <p className="mt-6 px-1 text-[7px] uppercase tracking-[0.15em] text-white/25">Monitoring</p>
          <PreviewNav icon={LayoutDashboard} label="Overview" active />
          <PreviewNav icon={CircleGauge} label="Monitors" />
          <PreviewNav icon={Clock3} label="Incidents" badge="1" />
          <PreviewNav icon={Bell} label="Email alerts" />

          <p className="mt-5 px-1 text-[7px] uppercase tracking-[0.15em] text-white/25">Configure</p>
          <PreviewNav icon={Settings2} label="Integrations" />
          <PreviewNav icon={Globe2} label="Status pages" />

          <div className="mt-auto rounded-lg border border-white/[0.07] bg-white/[0.025] p-2.5">
            <p className="text-[8px] font-medium text-white/55">System health</p>
            <p className="mt-1 flex items-center gap-1.5 text-[7px] text-emerald-300/70">
              <span className="size-1.5 rounded-full bg-emerald-400" /> All services online
            </p>
          </div>
        </aside>

        <div className="min-w-0 bg-[#0d0d0d]">
          <div className="flex h-12 items-center justify-between border-b border-white/[0.08] px-4">
            <div>
              <p className="text-[11px] font-bold text-white/85">Overview</p>
              <p className="text-[8px] text-white/25">Friday, July 3 · live workspace health</p>
            </div>
            <button type="button" className="flex items-center gap-1 rounded-md bg-white px-2.5 py-1.5 text-[8px] font-semibold text-black">
              <Plus className="size-2.5" /> Add monitor
            </button>
          </div>

          <div className="grid grid-cols-2 border-b border-white/[0.08] sm:grid-cols-4 lg:grid-cols-7">
            {metrics.map(([label, value, context, color]) => (
              <div key={label} className="border-r border-white/[0.07] p-3 transition-colors hover:bg-white/[0.02] last:border-r-0">
                <p className="truncate text-[7px] font-semibold uppercase tracking-[0.12em] text-white/25">{label}</p>
                <p className={`mt-1 text-base font-bold tracking-[-0.04em] ${color}`}>{value}</p>
                <p className="text-[7px] text-white/20">{context}</p>
              </div>
            ))}
          </div>

          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold text-white/75">Monitors</p>
                <p className="mt-0.5 text-[8px] text-white/25">Live endpoint health and recent performance</p>
              </div>
              <div className="flex gap-1">
                {['All', 'Up', 'Down'].map((filter, index) => (
                  <span key={filter} className={`rounded-md px-2 py-1 text-[7px] ${index === 0 ? 'bg-white text-black' : 'border border-white/[0.08] text-white/35'}`}>{filter}</span>
                ))}
              </div>
            </div>

            <div className="mt-3 overflow-hidden rounded-lg border border-white/[0.08]">
              <div className="grid grid-cols-[1.25fr_0.65fr_0.65fr_0.5fr] gap-2 border-b border-white/[0.08] bg-white/[0.025] px-3 py-2 text-[7px] font-semibold uppercase tracking-wider text-white/25 lg:grid-cols-[1.4fr_1.6fr_0.6fr_0.8fr_0.6fr_0.5fr_0.5fr_0.6fr]">
                <span>Monitor</span><span className="hidden lg:block">URL</span><span>Uptime</span><span className="hidden lg:block">Trend</span><span>Response</span><span className="hidden lg:block">Status</span><span className="hidden lg:block">Interval</span><span className="hidden lg:block">State</span>
              </div>
              {monitors.map((monitor, index) => {
                const down = monitor[7] === "DOWN";
                return (
                  <div key={monitor[0]} className="grid grid-cols-[1.25fr_0.65fr_0.65fr_0.5fr] items-center gap-2 border-b border-white/[0.06] px-3 py-2.5 text-[8px] transition-colors hover:bg-white/[0.018] last:border-b-0 lg:grid-cols-[1.4fr_1.6fr_0.6fr_0.8fr_0.6fr_0.5fr_0.5fr_0.6fr]">
                    <span className="flex items-center gap-2 truncate font-semibold text-white/65"><span className={`size-1.5 shrink-0 rounded-full ${down ? 'bg-red-400' : 'bg-emerald-400'}`} />{monitor[0]}</span>
                    <span className="hidden truncate font-mono text-white/25 lg:block">{monitor[1]}</span>
                    <span className="font-mono text-white/50">{monitor[2]}</span>
                    <MiniTrend down={down} offset={index} />
                    <span className="font-mono text-white/50">{monitor[3]}</span>
                    <span className={`hidden w-fit rounded border border-white/[0.08] px-1 py-0.5 font-mono lg:block ${down ? 'text-red-300' : 'text-emerald-300'}`}>{monitor[4]}</span>
                    <span className="hidden font-mono text-white/35 lg:block">{monitor[5]}</span>
                    <span className={`hidden w-fit rounded-md border border-white/[0.08] px-2 py-1 lg:flex lg:items-center lg:gap-1 ${down ? 'text-red-300' : 'text-emerald-300'}`}><span className={`size-1 rounded-full ${down ? 'bg-red-400' : 'bg-emerald-400'}`} />{monitor[7]}</span>
                  </div>
                );
              })}
            </div>

            <div className="mt-3 grid gap-3 lg:grid-cols-[1.7fr_0.7fr]">
              <AnimatedResponseChart />
              <div className="rounded-lg border border-white/[0.08] bg-white/[0.018] p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><ChartNoAxesCombined className="size-3 text-blue-300" /><span className="text-[8px] font-semibold text-white/55">Latest incident</span></div>
                  <span className="rounded-full border border-red-400/15 bg-red-400/[0.07] px-1.5 py-0.5 text-[7px] text-red-300">Active</span>
                </div>
                <p className="mt-3 text-[9px] font-medium text-white/70">Payments API unavailable</p>
                <p className="mt-1 text-[7px] leading-3 text-white/25">Detected 12 minutes ago · FRA region</p>
                <div className="mt-3 flex items-center gap-1.5">
                  {["Detected", "Alerted", "Monitoring"].map((step, index) => (
                    <div key={step} className="flex-1">
                      <div className={`h-1 rounded-full ${index < 2 ? "bg-red-400/70" : "bg-blue-300/60"}`} />
                      <p className="mt-1 text-[6px] text-white/20">{step}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-white/[0.06] pt-2 text-[7px]"><span className="text-white/25">Email + Slack</span><span className="text-emerald-300">Delivered in 1.2s</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PreviewNav = ({ icon: Icon, label, active, badge }: { icon: typeof Activity; label: string; active?: boolean; badge?: string }) => (
  <div className={`mt-1 flex items-center gap-2 rounded-md px-2 py-1.5 text-[8px] ${active ? 'bg-white/[0.07] text-white/75' : 'text-white/30'}`}>
    <Icon className="size-3" /><span>{label}</span>{badge && <span className="ml-auto rounded bg-red-400/15 px-1 text-red-300">{badge}</span>}
  </div>
);

const MiniTrend = ({ down, offset }: { down: boolean; offset: number }) => (
  <svg viewBox="0 0 70 18" className="hidden h-4 w-16 lg:block" aria-hidden="true">
    <path d={down ? "M0 4 L10 5 L20 3 L30 7 L40 6 L50 15 L60 14 L70 16" : `M0 ${12-offset} L10 10 L20 12 L30 7 L40 9 L50 5 L60 7 L70 3`} fill="none" stroke={down ? "#f87171" : "#4ade80"} strokeWidth="1.4" />
  </svg>
);

export default UptimeSentinelOverviewPreview;
