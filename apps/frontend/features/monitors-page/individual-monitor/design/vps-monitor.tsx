"use client";

import type { ReactNode } from "react";
import {
  Activity,
  BellRing,
  Clock3,
  Database,
  Gauge,
  HardDrive,
  History,
  Network,
  Server,
  Settings2,
  ShieldCheck,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import {
  KeyValue,
  KeyValueList,
  Panel,
  Pill,
  TableScroll,
  type Tone,
} from "../monitor-detail-primitives";
import { TrendChart } from "../monitor-detail-charts";

const toneIconClass: Record<Tone, string> = {
  neutral: "text-sf-text-muted",
  info: "text-[var(--sf-protocol-accent)]",
  positive: "text-sf-green",
  warning: "text-sf-amber",
  negative: "text-sf-red",
};

const VpsPanelHeader = ({
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

const mockVpsMonitor = {
  hostname: "prod-api-01",
  address: "203.0.113.42",
  provider: "AWS Lightsail",
  location: "Mumbai · ap-south-1",
  operatingSystem: "Ubuntu 24.04 LTS",
  kernel: "Linux 6.8 · x86_64",
  cpuModel: "4 vCPU",
  memoryTotal: "8 GB",
  agent: "Telegraf",
  agentState: "Connected",
  lastSample: "18 seconds ago",
  nextSample: "in 12 seconds",
  uptime: "42d 7h",
  cpu: 37,
  memory: 68,
  disk: 54,
  load: 1.42,
  swap: 8,
  cpuThreshold: 85,
  memoryThreshold: 90,
  diskThreshold: 85,
  categories: [
    "00:00", "01:00", "02:00", "03:00", "04:00", "05:00",
    "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
    "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
    "18:00", "19:00", "20:00", "21:00", "22:00", "now",
  ],
  cpuTrend: [24, 22, 20, 18, 19, 21, 28, 35, 41, 46, 52, 49, 44, 39, 43, 58, 63, 56, 48, 45, 41, 39, 35, 37],
  memoryTrend: [61, 61, 62, 62, 62, 63, 63, 64, 64, 65, 66, 66, 66, 67, 67, 68, 69, 69, 69, 68, 68, 68, 68, 68],
  networkRx: [8, 7, 6, 5, 5, 7, 12, 18, 24, 29, 35, 31, 26, 24, 28, 39, 44, 41, 33, 29, 25, 22, 18, 16],
  networkTx: [3, 3, 2, 2, 2, 3, 5, 7, 9, 11, 14, 12, 10, 9, 11, 16, 18, 17, 13, 11, 10, 9, 8, 7],
  filesystems: [
    { mount: "/", filesystem: "ext4", size: "80 GB", used: "39.2 GB", available: "36.7 GB", inodes: "6%", percent: 52, tone: "positive" as Tone },
    { mount: "/var/lib/postgresql", filesystem: "ext4", size: "60 GB", used: "36.8 GB", available: "20.1 GB", inodes: "9%", percent: 65, tone: "positive" as Tone },
    { mount: "/srv/backups", filesystem: "xfs", size: "160 GB", used: "86.4 GB", available: "65.6 GB", inodes: "3%", percent: 54, tone: "positive" as Tone },
  ],
  hostPressure: [
    { label: "CPU user", value: "29%", context: "Application work", tone: "neutral" as Tone },
    { label: "CPU system", value: "6.3%", context: "Kernel work", tone: "neutral" as Tone },
    { label: "I/O wait", value: "1.4%", context: "No storage pressure", tone: "positive" as Tone },
    { label: "Steal time", value: "0.3%", context: "Healthy VPS host", tone: "positive" as Tone },
    { label: "Available memory", value: "2.6 GB", context: "32% available", tone: "positive" as Tone },
    { label: "Swap activity", value: "0 B/s", context: "No paging", tone: "positive" as Tone },
  ],
  loadAverages: [
    { label: "1 minute", value: "1.42", context: "36% of 4 vCPU" },
    { label: "5 minutes", value: "1.18", context: "Stable" },
    { label: "15 minutes", value: "0.96", context: "Below baseline" },
  ],
  processes: [
    { label: "Running", value: 2, tone: "positive" as Tone },
    { label: "Sleeping", value: 153, tone: "neutral" as Tone },
    { label: "Blocked", value: 0, tone: "positive" as Tone },
    { label: "Zombies", value: 0, tone: "positive" as Tone },
  ],
  diskIo: {
    read: "12.4 MB/s",
    write: "4.8 MB/s",
    operations: "184 IOPS",
    utilization: "18%",
    await: "3.2ms",
    queueDepth: "0.12",
  },
  networkHealth: [
    { label: "Packets", value: "18.4k/s", context: "eth0 combined" },
    { label: "Dropped", value: "0", context: "Last 24 hours" },
    { label: "Interface errors", value: "0", context: "Last 24 hours" },
    { label: "Retransmits", value: "0.02%", context: "Below 1% warning" },
  ],
  tcpStates: [
    { label: "Established", value: 184 },
    { label: "Listening", value: 21 },
    { label: "Time wait", value: 67 },
    { label: "Close wait", value: 2 },
  ],
  agentReliability: [
    { label: "Agent version", value: "Current", context: "Telegraf stable channel" },
    { label: "Delivery delay", value: "240ms", context: "Agent → ingestion" },
    { label: "Samples · 24h", value: "2,880", context: "30-second interval" },
    { label: "Missed samples", value: "0", context: "No collection gaps" },
    { label: "Payload", value: "8.4 KB", context: "Latest compressed batch" },
    { label: "Reconnects", value: "1", context: "Last 30 days" },
  ],
  services: [
    { name: "nginx", state: "Running", uptime: "42d 7h", restarts: 0, cpu: "1.8%", memory: "126 MB" },
    { name: "postgresql", state: "Running", uptime: "42d 7h", restarts: 0, cpu: "8.6%", memory: "1.9 GB" },
    { name: "redis-server", state: "Running", uptime: "42d 7h", restarts: 0, cpu: "2.1%", memory: "384 MB" },
    { name: "statusforge-worker", state: "Running", uptime: "11d 3h", restarts: 1, cpu: "6.4%", memory: "512 MB" },
  ],
  agentConfig: {
    collectionInterval: "30 seconds",
    transport: "HTTPS · outbound only",
    authentication: "Per-server token",
    payload: "Batched JSON",
    inputs: "CPU, memory, disk, disk I/O, network, system, processes",
    retention: "Static preview",
  },
  alertRules: [
    { label: "High CPU", description: "CPU remains above 85% for 5 minutes.", enabled: true },
    { label: "High memory", description: "Memory utilization remains above 90% for 5 minutes.", enabled: true },
    { label: "Disk capacity", description: "Any monitored filesystem reaches 85% used.", enabled: true },
    { label: "High load", description: "The 5-minute load average exceeds 4.0.", enabled: true },
    { label: "Agent offline", description: "No metric sample arrives for 2 minutes.", enabled: true },
    { label: "Swap pressure", description: "Swap utilization rises above 20%.", enabled: false },
    { label: "Network quality", description: "Packet drops, interface errors or retransmits cross their thresholds.", enabled: true },
    { label: "Service stopped", description: "A configured system service stops or repeatedly restarts.", enabled: true },
  ],
  history: [
    { id: "vps-h-1", type: "Resources healthy", description: "CPU and memory returned to their normal operating range.", occurredAt: "Today · 14:26", tone: "positive" as Tone },
    { id: "vps-h-2", type: "CPU threshold warning", description: "CPU reached 87% for 2 minutes during a deployment; the 5-minute alert window was not breached.", occurredAt: "Today · 14:18", tone: "warning" as Tone },
    { id: "vps-h-3", type: "Agent reconnected", description: "Metric delivery resumed after a 46-second network interruption.", occurredAt: "Aug 09 · 03:42", tone: "neutral" as Tone },
    { id: "vps-h-4", type: "Host rebooted", description: "System boot ID changed and uptime restarted after planned maintenance.", occurredAt: "Jun 30 · 02:10", tone: "neutral" as Tone },
  ],
} as const;

const summaryStats = [
  { label: "CPU", value: mockVpsMonitor.cpu, unit: "%", hint: "Threshold 85%" },
  { label: "Memory", value: mockVpsMonitor.memory, unit: "%", hint: "5.4 of 8 GB" },
  { label: "Disk", value: mockVpsMonitor.disk, unit: "%", hint: "86.4 of 160 GB" },
  { label: "Load · 1m", value: mockVpsMonitor.load, unit: "", hint: "4 vCPU" },
  { label: "Swap", value: mockVpsMonitor.swap, unit: "%", hint: "164 of 2 GB" },
  { label: "Uptime", value: mockVpsMonitor.uptime, unit: "", hint: "Since Jun 30" },
] as const;

const VpsStatusSummary = () => (
  <div className="space-y-2.5">
    <Panel className="relative bg-sf-surface">
      <div className="flex flex-col gap-3 px-[18px] py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-start gap-3.5">
          <span className="flex size-[34px] shrink-0 items-center justify-center rounded-[9px] border border-sf-green-border bg-sf-green-bg text-sf-green">
            <Server className="size-[17px]" strokeWidth={1.8} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-[16.5px] font-semibold leading-none tracking-[-0.015em] text-sf-text">
                Server healthy
              </h1>
              <Pill tone="positive" dot>{mockVpsMonitor.agentState}</Pill>
              <Pill tone="neutral">Hardcoded preview</Pill>
              <Pill tone="neutral">{mockVpsMonitor.location}</Pill>
            </div>
            <p className="mt-2 font-mono text-[11.5px] text-sf-text-sub">
              {mockVpsMonitor.hostname} · {mockVpsMonitor.address}
            </p>
            <p className="mt-1 max-w-4xl text-[12.5px] leading-[1.55] text-sf-text-muted">
              The host agent is reporting normally. CPU, memory, storage, load and network activity are inside their configured thresholds.
            </p>
          </div>
        </div>

        <dl className="grid shrink-0 grid-cols-2 divide-x divide-sf-border-faint">
          <div className="min-w-32 px-4 py-1">
            <dt className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-sf-text-muted">
              <Clock3 className="size-3" aria-hidden="true" />
              Last sample
            </dt>
            <dd className="mt-1.5 text-xs font-medium text-sf-text">{mockVpsMonitor.lastSample}</dd>
          </div>
          <div className="min-w-32 px-4 py-1">
            <dt className="text-[10px] font-semibold uppercase tracking-[0.1em] text-sf-text-muted">Next sample</dt>
            <dd className="mt-1.5 text-xs font-medium text-[var(--sf-protocol-accent)]">{mockVpsMonitor.nextSample}</dd>
          </div>
        </dl>
      </div>
    </Panel>

    <Panel>
      <dl className="grid grid-cols-2 gap-px bg-sf-border-faint sm:grid-cols-3 xl:grid-cols-6">
        {summaryStats.map((stat) => (
          <div key={stat.label} className="min-w-0 bg-sf-surface px-4 py-3">
            <dt className="text-[10px] font-semibold uppercase tracking-[0.11em] text-sf-text-muted">{stat.label}</dt>
            <dd className="mt-2 truncate text-[23px] font-semibold leading-none tracking-[-0.035em] tabular-nums text-sf-text">
              {stat.value}
              {stat.unit ? <span className="ml-1 text-xs font-medium tracking-normal text-sf-text-muted">{stat.unit}</span> : null}
            </dd>
            <dd className="mt-1.5 text-[11px] leading-relaxed text-sf-text-muted">{stat.hint}</dd>
          </div>
        ))}
      </dl>
    </Panel>
  </div>
);

const ResourceTrendCard = () => (
  <Panel>
    <VpsPanelHeader
      icon={Activity}
      tone="info"
      title="Resource utilization"
      meta="CPU and memory · Last 24 hours"
    />
    <div className="px-4 pb-2 pt-2.5">
      <TrendChart
        series={[
          { name: "CPU", values: [...mockVpsMonitor.cpuTrend], tone: "info" },
          { name: "Memory", values: [...mockVpsMonitor.memoryTrend], tone: "warning" },
        ]}
        categories={[...mockVpsMonitor.categories]}
        threshold={mockVpsMonitor.cpuThreshold}
        unit="%"
        height={220}
        area={false}
      />
    </div>
    <div className="grid grid-cols-2 gap-px border-t border-sf-border-faint bg-sf-border-faint sm:grid-cols-4">
      {[
        ["CPU now", "37%", "Peak 63%"],
        ["CPU average", "36%", "24-hour mean"],
        ["Memory now", "68%", "5.4 of 8 GB"],
        ["Memory peak", "69%", "Below 90% alert"],
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

const UtilizationBar = ({ value, tone = "info" }: { value: number; tone?: Tone }) => (
  <div className="h-1.5 w-24 overflow-hidden rounded-full bg-sf-border-faint">
    <div
      className={`h-full rounded-full ${tone === "warning" ? "bg-sf-amber" : tone === "positive" ? "bg-sf-green" : "bg-[var(--sf-protocol-accent)]"}`}
      style={{ width: `${value}%` }}
    />
  </div>
);

const HostPressureCard = () => (
  <Panel>
    <VpsPanelHeader
      icon={Gauge}
      tone="info"
      title="Host pressure"
      meta="CPU scheduler, memory and swap · Current sample"
    />
    <div className="grid grid-cols-2 gap-px bg-sf-border-faint sm:grid-cols-3 xl:grid-cols-6">
      {mockVpsMonitor.hostPressure.map((metric) => (
        <div key={metric.label} className="min-w-0 bg-sf-surface px-3 py-3.5">
          <div className="flex items-center gap-2">
            <span className={`size-1.5 rounded-full ${metric.tone === "positive" ? "bg-sf-green" : "bg-sf-text-muted"}`} />
            <p className="truncate text-[10px] font-semibold uppercase tracking-[0.08em] text-sf-text-muted">{metric.label}</p>
          </div>
          <p className={`mt-2 text-lg font-semibold tabular-nums ${metric.tone === "positive" ? "text-sf-green" : "text-sf-text"}`}>{metric.value}</p>
          <p className="mt-1 text-[10.5px] leading-relaxed text-sf-text-muted">{metric.context}</p>
        </div>
      ))}
    </div>
  </Panel>
);

const FilesystemCard = () => (
  <Panel>
    <VpsPanelHeader icon={HardDrive} title="Filesystem capacity" meta="Agent disk input · Local mounts" />
    <TableScroll>
      <table className="w-full min-w-[860px] text-left text-xs">
        <thead className="border-b border-sf-border bg-sf-bg/70 text-[10px] uppercase tracking-[0.1em] text-sf-text-muted">
          <tr>
            <th className="px-4 py-2.5 font-semibold">Mount</th>
            <th className="px-3 py-2.5 font-semibold">Filesystem</th>
            <th className="px-3 py-2.5 text-right font-semibold">Size</th>
            <th className="px-3 py-2.5 text-right font-semibold">Used</th>
            <th className="px-3 py-2.5 text-right font-semibold">Available</th>
            <th className="px-3 py-2.5 text-right font-semibold">Inodes</th>
            <th className="px-4 py-2.5 text-right font-semibold">Utilization</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-sf-border-faint">
          {mockVpsMonitor.filesystems.map((row) => (
            <tr key={row.mount} className="transition-colors hover:bg-sf-bg/60">
              <td className="px-4 py-2.5 font-mono text-[11.5px] font-semibold text-sf-text">{row.mount}</td>
              <td className="px-3 py-2.5 text-sf-text-muted">{row.filesystem}</td>
              <td className="px-3 py-2.5 text-right tabular-nums text-sf-text-muted">{row.size}</td>
              <td className="px-3 py-2.5 text-right tabular-nums text-sf-text">{row.used}</td>
              <td className="px-3 py-2.5 text-right tabular-nums text-sf-text-muted">{row.available}</td>
              <td className="px-3 py-2.5 text-right tabular-nums text-sf-text-muted">{row.inodes}</td>
              <td className="px-4 py-2.5">
                <div className="flex items-center justify-end gap-3">
                  <UtilizationBar value={row.percent} tone={row.tone} />
                  <span className="w-9 text-right tabular-nums font-medium text-sf-text">{row.percent}%</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableScroll>
  </Panel>
);

const LoadCard = () => (
  <Panel>
    <VpsPanelHeader icon={Gauge} title="System load" meta={`${mockVpsMonitor.cpuModel} · normalized capacity 4.0`} />
    <div className="grid grid-cols-3 gap-px bg-sf-border-faint">
      {mockVpsMonitor.loadAverages.map((metric) => (
        <div key={metric.label} className="bg-sf-surface px-4 py-4 text-center">
          <p className="text-[22px] font-semibold leading-none tabular-nums text-sf-text">{metric.value}</p>
          <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-sf-text-muted">{metric.label}</p>
          <p className="mt-1.5 text-[10.5px] text-sf-text-muted">{metric.context}</p>
        </div>
      ))}
    </div>
  </Panel>
);

const ProcessCard = () => (
  <Panel>
    <VpsPanelHeader icon={Workflow} title="Process health" meta="155 processes · 0 zombies" />
    <div className="grid grid-cols-2 gap-px bg-sf-border-faint sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
      {mockVpsMonitor.processes.map((metric) => (
        <div key={metric.label} className="bg-sf-surface px-3 py-4 text-center">
          <p className={`text-[22px] font-semibold leading-none tabular-nums ${metric.tone === "positive" ? "text-sf-green" : "text-sf-text"}`}>{metric.value}</p>
          <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-sf-text-muted">{metric.label}</p>
        </div>
      ))}
    </div>
  </Panel>
);

const NetworkCard = () => (
  <Panel>
    <VpsPanelHeader icon={Network} tone="info" title="Network throughput" meta="Primary interface eth0 · Last 24 hours" />
    <div className="px-4 pb-2 pt-2.5">
      <TrendChart
        series={[
          { name: "Received", values: [...mockVpsMonitor.networkRx], tone: "info" },
          { name: "Transmitted", values: [...mockVpsMonitor.networkTx], tone: "positive" },
        ]}
        categories={[...mockVpsMonitor.categories]}
        unit=" Mbps"
        height={200}
        area={false}
      />
    </div>
    <div className="grid grid-cols-2 gap-px border-t border-sf-border-faint bg-sf-border-faint sm:grid-cols-4">
      {[
        ["Receive now", "16 Mbps"],
        ["Transmit now", "7 Mbps"],
        ["Received · 24h", "184 GB"],
        ["Transmitted · 24h", "71 GB"],
      ].map(([label, value]) => (
        <div key={label} className="bg-sf-surface px-4 py-3 text-center">
          <p className="text-base font-semibold tabular-nums text-sf-text">{value}</p>
          <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-sf-text-muted">{label}</p>
        </div>
      ))}
    </div>
  </Panel>
);

const NetworkHealthCard = () => (
  <Panel>
    <VpsPanelHeader
      icon={ShieldCheck}
      title="Network health & TCP states"
      meta={<Pill tone="positive">No packet loss</Pill>}
    />
    <div className="grid lg:grid-cols-2 lg:divide-x lg:divide-sf-border-faint">
      <div className="grid grid-cols-2 gap-px bg-sf-border-faint">
        {mockVpsMonitor.networkHealth.map((metric) => (
          <div key={metric.label} className="bg-sf-surface px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-sf-text-muted">{metric.label}</p>
            <p className="mt-2 text-lg font-semibold tabular-nums text-sf-text">{metric.value}</p>
            <p className="mt-1 text-[10.5px] text-sf-text-muted">{metric.context}</p>
          </div>
        ))}
      </div>
      <div>
        <p className="border-b border-sf-border-faint px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-sf-text-muted">Current TCP connections</p>
        <div className="grid grid-cols-2 gap-px bg-sf-border-faint sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
          {mockVpsMonitor.tcpStates.map((state) => (
            <div key={state.label} className="bg-sf-surface px-3 py-4 text-center">
              <p className="text-xl font-semibold tabular-nums text-sf-text">{state.value}</p>
              <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.07em] text-sf-text-muted">{state.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </Panel>
);

const DiskIoCard = () => (
  <Panel>
    <VpsPanelHeader icon={Database} title="Disk I/O" meta="Device nvme0n1 · Current sample" />
    <KeyValueList className="[&>div]:py-2.5 [&>div>dd]:!text-xs [&>div>dt]:!text-xs">
      <KeyValue label="Read throughput">{mockVpsMonitor.diskIo.read}</KeyValue>
      <KeyValue label="Write throughput">{mockVpsMonitor.diskIo.write}</KeyValue>
      <KeyValue label="Operations">{mockVpsMonitor.diskIo.operations}</KeyValue>
      <KeyValue label="Device utilization">{mockVpsMonitor.diskIo.utilization}</KeyValue>
      <KeyValue label="Average wait">{mockVpsMonitor.diskIo.await}</KeyValue>
      <KeyValue label="Queue depth">{mockVpsMonitor.diskIo.queueDepth}</KeyValue>
    </KeyValueList>
  </Panel>
);

const AgentReliabilityCard = () => (
  <Panel>
    <VpsPanelHeader
      icon={Activity}
      tone="info"
      title="Agent delivery health"
      meta={<Pill tone="positive">All samples received</Pill>}
    />
    <div className="grid grid-cols-2 gap-px bg-sf-border-faint sm:grid-cols-3 xl:grid-cols-6">
      {mockVpsMonitor.agentReliability.map((metric) => (
        <div key={metric.label} className="min-w-0 bg-sf-surface px-3 py-3.5">
          <p className="truncate text-[10px] font-semibold uppercase tracking-[0.08em] text-sf-text-muted">{metric.label}</p>
          <p className="mt-2 truncate text-lg font-semibold tabular-nums text-sf-text">{metric.value}</p>
          <p className="mt-1 text-[10.5px] leading-relaxed text-sf-text-muted">{metric.context}</p>
        </div>
      ))}
    </div>
  </Panel>
);

const ServiceHealthCard = () => (
  <Panel>
    <VpsPanelHeader
      icon={Workflow}
      title="Configured service health"
      meta="systemd and procstat inputs · 4 of 4 running"
    />
    <TableScroll>
      <table className="w-full min-w-[720px] text-left text-xs">
        <thead className="border-b border-sf-border bg-sf-bg/70 text-[10px] uppercase tracking-[0.1em] text-sf-text-muted">
          <tr>
            <th className="px-4 py-2.5 font-semibold">Service</th>
            <th className="px-3 py-2.5 font-semibold">State</th>
            <th className="px-3 py-2.5 text-right font-semibold">Uptime</th>
            <th className="px-3 py-2.5 text-right font-semibold">Restarts</th>
            <th className="px-3 py-2.5 text-right font-semibold">CPU</th>
            <th className="px-4 py-2.5 text-right font-semibold">Memory</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-sf-border-faint">
          {mockVpsMonitor.services.map((service) => (
            <tr key={service.name} className="transition-colors hover:bg-sf-bg/60">
              <td className="px-4 py-2.5 font-mono text-[11.5px] font-semibold text-sf-text">{service.name}</td>
              <td className="px-3 py-2.5"><Pill tone="positive" dot>{service.state}</Pill></td>
              <td className="px-3 py-2.5 text-right tabular-nums text-sf-text-muted">{service.uptime}</td>
              <td className="px-3 py-2.5 text-right tabular-nums text-sf-text-muted">{service.restarts}</td>
              <td className="px-3 py-2.5 text-right tabular-nums text-sf-text">{service.cpu}</td>
              <td className="px-4 py-2.5 text-right tabular-nums text-sf-text">{service.memory}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableScroll>
  </Panel>
);

const AgentConfigCard = () => (
  <Panel>
    <VpsPanelHeader icon={Settings2} title="Host & agent configuration" meta="Read-only preview" />
    <div className="grid grid-cols-1 md:grid-cols-2 md:divide-x md:divide-sf-border-faint">
      <KeyValueList className="[&>div]:py-2.5 [&>div>dd]:!text-xs [&>div>dt]:!text-xs">
        <KeyValue label="Hostname" mono>{mockVpsMonitor.hostname}</KeyValue>
        <KeyValue label="Public address" mono>{mockVpsMonitor.address}</KeyValue>
        <KeyValue label="Provider">{mockVpsMonitor.provider}</KeyValue>
        <KeyValue label="Location">{mockVpsMonitor.location}</KeyValue>
        <KeyValue label="Operating system">{mockVpsMonitor.operatingSystem}</KeyValue>
        <KeyValue label="Kernel">{mockVpsMonitor.kernel}</KeyValue>
      </KeyValueList>
      <KeyValueList className="[&>div]:py-2.5 [&>div>dd]:!text-xs [&>div>dt]:!text-xs">
        <KeyValue label="Collector">{mockVpsMonitor.agent}</KeyValue>
        <KeyValue label="Collection interval">{mockVpsMonitor.agentConfig.collectionInterval}</KeyValue>
        <KeyValue label="Transport">{mockVpsMonitor.agentConfig.transport}</KeyValue>
        <KeyValue label="Authentication">{mockVpsMonitor.agentConfig.authentication}</KeyValue>
        <KeyValue label="Payload">{mockVpsMonitor.agentConfig.payload}</KeyValue>
        <KeyValue label="Enabled inputs">{mockVpsMonitor.agentConfig.inputs}</KeyValue>
      </KeyValueList>
    </div>
  </Panel>
);

const AlertRulesCard = () => {
  const activeCount = mockVpsMonitor.alertRules.filter((rule) => rule.enabled).length;
  return (
    <Panel>
      <VpsPanelHeader icon={BellRing} title="VPS alert rules" meta={`${activeCount} of ${mockVpsMonitor.alertRules.length} active · sustained windows`} />
      <div className="grid md:grid-cols-2">
        {mockVpsMonitor.alertRules.map((rule) => (
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

const HistoryCard = () => (
  <Panel>
    <VpsPanelHeader icon={History} title="Host event history" meta="Threshold changes and agent state" />
    <div className="px-4 py-1">
      {mockVpsMonitor.history.map((event, index) => (
        <div key={event.id} className="relative py-2.5 pl-8">
          {index < mockVpsMonitor.history.length - 1 ? <span className="absolute bottom-0 left-[7px] top-7 w-px bg-sf-border" /> : null}
          <span className={`absolute left-0 top-[18px] size-3.5 rounded-full border-[3px] border-sf-surface ${eventDot[event.tone]}`} />
          <div>
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <p className={`text-xs font-semibold ${event.tone === "warning" ? "text-sf-amber" : event.tone === "positive" ? "text-sf-green" : "text-sf-text"}`}>{event.type}</p>
              <time className="font-mono text-[11px] tabular-nums text-sf-text-muted">{event.occurredAt}</time>
            </div>
            <p className="mt-1 text-xs leading-5 text-sf-text-muted">{event.description}</p>
          </div>
        </div>
      ))}
    </div>
  </Panel>
);

const VpsMonitor = () => (
  <section id="vps-monitoring" className="protocol-detail-theme scroll-mt-16 space-y-3">
    <VpsStatusSummary />

    <section aria-labelledby="vps-resources-heading">
      <h2 id="vps-resources-heading" className="sr-only">Resource utilization</h2>
      <ResourceTrendCard />
      <div className="mt-3">
        <HostPressureCard />
      </div>
      <div className="mt-3 grid items-start gap-3 lg:grid-cols-2">
        <LoadCard />
        <ProcessCard />
      </div>
      <div className="mt-3">
        <FilesystemCard />
      </div>
    </section>

    <section aria-labelledby="vps-io-heading">
      <h2 id="vps-io-heading" className="sr-only">Network and disk activity</h2>
      <div className="grid items-start gap-3 lg:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.55fr)]">
        <NetworkCard />
        <DiskIoCard />
      </div>
      <div className="mt-3">
        <NetworkHealthCard />
      </div>
    </section>

    <section aria-labelledby="vps-operations-heading">
      <h2 id="vps-operations-heading" className="sr-only">VPS configuration and operations</h2>
      <AgentReliabilityCard />
      <div className="mt-3">
        <ServiceHealthCard />
      </div>
      <div className="mt-3">
        <AgentConfigCard />
      </div>
      <div className="mt-3">
        <AlertRulesCard />
      </div>
      <div className="mt-3">
        <HistoryCard />
      </div>
    </section>

    <Panel className="border-[var(--sf-protocol-accent-border)] bg-[var(--sf-protocol-accent-soft)]">
      <div className="flex items-start gap-3 px-4 py-3 text-xs text-sf-text-muted">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-[var(--sf-protocol-accent)]" aria-hidden="true" />
        <p className="leading-5">
          Static frontend preview. Every displayed metric can be collected by a standard host agent; ingestion, persistence and alert evaluation are not connected yet.
        </p>
      </div>
    </Panel>
  </section>
);

export default VpsMonitor;
