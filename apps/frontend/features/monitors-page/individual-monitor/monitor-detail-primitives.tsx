import { Ban, Check, Minus, TriangleAlert, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

/**
 * Linear-inspired design kit for the TLS / DNS / multi-region detail tabs.
 * Built on the shared `sf-*` token system (globals.css) and mirrors the
 * Overview page language: status hero → KPI cards → labelled panel groups.
 * Hierarchy comes from weight + color + spacing, not from shrinking text.
 */

export type Tone = "neutral" | "positive" | "warning" | "negative" | "info";

type ToneStyle = {
  /** foreground text color */
  text: string;
  /** soft icon-chip: tinted bg + colored glyph */
  soft: string;
  /** bordered pill / status square: border + bg + text */
  pill: string;
  /** solid fill for dots, bars, glows */
  solid: string;
  /** quiet tinted surface for verdict banners */
  tint: string;
};

const TONE: Record<Tone, ToneStyle> = {
  neutral: {
    text: "text-sf-text",
    soft: "bg-sf-bg text-sf-text-muted",
    pill: "border-sf-border bg-sf-bg text-sf-text-muted",
    solid: "bg-sf-text-muted/60",
    tint: "bg-sf-bg",
  },
  positive: {
    text: "text-sf-green",
    soft: "bg-sf-green/10 text-sf-green",
    pill: "border-sf-green-border bg-sf-green-bg text-sf-green",
    solid: "bg-sf-green",
    tint: "bg-sf-green-bg/45",
  },
  warning: {
    text: "text-sf-amber",
    soft: "bg-sf-amber/10 text-sf-amber",
    pill: "border-sf-amber-border bg-sf-amber-bg text-sf-amber",
    solid: "bg-sf-amber",
    tint: "bg-sf-amber-bg/45",
  },
  negative: {
    text: "text-sf-red",
    soft: "bg-sf-red/10 text-sf-red",
    pill: "border-sf-red-border bg-sf-red-bg text-sf-red",
    solid: "bg-sf-red",
    tint: "bg-sf-red-bg/45",
  },
  info: {
    text: "text-sf-blue",
    soft: "bg-sf-blue/10 text-sf-blue",
    pill: "border-sf-blue/30 bg-sf-blue-bg text-sf-blue",
    solid: "bg-sf-blue",
    tint: "bg-sf-blue-bg/45",
  },
};

const TONE_ICON: Record<Tone, LucideIcon> = {
  neutral: Minus,
  positive: Check,
  warning: TriangleAlert,
  negative: Ban,
  info: Check,
};

export const toneStyle = (tone: Tone) => TONE[tone];

/* ------------------------------------------------------------------ */
/* Layout shells                                                       */
/* ------------------------------------------------------------------ */

export const Panel = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => (
  <section
    className={`sf-panel overflow-hidden rounded-xl transition-colors duration-200 ${className}`}
  >
    {children}
  </section>
);

export const DetailSection = ({
  icon: Icon,
  title,
  description,
  action,
  children,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
  children: ReactNode;
}) => (
  <section className="pt-5">
    <div className="mb-4 flex flex-col gap-3 border-b border-sf-border-faint pb-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <Icon
          className="mt-0.5 size-4 shrink-0 text-sf-text-muted"
          strokeWidth={1.8}
        />
        <div className="min-w-0">
          <h3 className="text-sm font-semibold tracking-sf-tight text-sf-text">
            {title}
          </h3>
          <p className="mt-1 max-w-2xl text-xs leading-relaxed text-sf-text-muted">
            {description}
          </p>
        </div>
      </div>
      {action ? (
        <div className="shrink-0 text-xs text-sf-text-muted">{action}</div>
      ) : null}
    </div>
    {children}
  </section>
);

export const DetailSummary = ({
  hero,
  children,
}: {
  hero: ReactNode;
  children: ReactNode;
}) => (
  <Panel className="bg-sf-surface">
    {hero}
    <div className="grid border-t border-sf-border-faint sm:grid-cols-2 xl:grid-cols-4">
      {children}
    </div>
  </Panel>
);

export const PanelHeader = ({
  icon: Icon,
  title,
  description,
  action,
  tone = "neutral",
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  tone?: Tone;
}) => (
  <div className="flex items-start justify-between gap-5 border-b border-sf-border-faint px-5 py-4.5 sm:px-6">
    <div className="flex min-w-0 items-start gap-3">
      <Icon
        className={`mt-0.5 size-4 shrink-0 ${TONE[tone].text}`}
        strokeWidth={1.8}
      />
      <div className="min-w-0">
        <h3 className="text-sm font-semibold tracking-sf-tight text-sf-text">
          {title}
        </h3>
        {description ? (
          <p className="mt-1 text-xs leading-relaxed text-sf-text-muted">
            {description}
          </p>
        ) : null}
      </div>
    </div>
    {action ? (
      <div className="shrink-0 text-right text-xs text-sf-text-muted">
        {action}
      </div>
    ) : null}
  </div>
);

/** Group divider: eyebrow label with a trailing hairline rule. */
export const SectionLabel = ({
  icon: Icon,
  children,
}: {
  icon?: LucideIcon;
  children: ReactNode;
}) => (
  <div className="mb-3 mt-10 flex items-center gap-3">
    <span className="flex size-6 shrink-0 items-center justify-center text-sf-text-muted">
      {Icon ? <Icon className="size-4" strokeWidth={1.8} /> : null}
    </span>
    <div className="min-w-0">
      <h3 className="text-[13px] font-semibold tracking-sf-tight text-sf-text">
        {children}
      </h3>
    </div>
    <span className="h-px flex-1 bg-sf-border-faint" />
  </div>
);

/* ------------------------------------------------------------------ */
/* Hero + KPI                                                          */
/* ------------------------------------------------------------------ */

export const DetailHero = ({
  icon: Icon,
  tone,
  title,
  subtitle,
  pill,
  meta,
}: {
  icon: LucideIcon;
  tone: Tone;
  title: string;
  subtitle: string;
  pill?: ReactNode;
  meta?: ReactNode;
}) => (
  <div className="relative">
    <span
      className={`absolute bottom-5 left-0 top-5 w-0.5 rounded-full ${TONE[tone].solid}`}
      aria-hidden="true"
    />
    <div className="flex flex-col gap-5 px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div className="flex min-w-0 items-start gap-3.5 sm:items-center">
        <span
          className={`flex size-10 shrink-0 items-center justify-center rounded-lg border ${TONE[tone].pill}`}
        >
          <Icon className="size-[18px]" strokeWidth={1.8} />
        </span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-semibold tracking-[-0.025em] text-sf-text">
              {title}
            </h2>
            {pill}
          </div>
          <p className="mt-1.5 max-w-2xl text-xs leading-relaxed text-sf-text-sub">
            {subtitle}
          </p>
        </div>
      </div>
      {meta ? (
        <div className="shrink-0 text-xs leading-relaxed text-sf-text-muted sm:max-w-[280px] sm:text-right">
          {meta}
        </div>
      ) : null}
    </div>
  </div>
);

export const KpiCard = ({
  label,
  value,
  context,
  icon: Icon,
  tone = "info",
  valueTone,
}: {
  label: string;
  value: ReactNode;
  context?: ReactNode;
  icon: LucideIcon;
  tone?: Tone;
  valueTone?: Tone;
}) => (
  <article className="group relative flex min-h-[112px] flex-col justify-between border-sf-border-faint p-4 transition-colors hover:bg-sf-bg/75 [&:not(:first-child)]:border-t sm:border-r sm:p-5 sm:even:border-r-0 sm:[&:nth-child(2)]:border-t-0 sm:[&:nth-child(n+3)]:border-t xl:even:border-r xl:last:border-r-0 xl:[&:nth-child(n+3)]:border-t-0">
    <div className="flex items-center justify-between gap-2">
      <p className="truncate text-[10px] font-semibold uppercase tracking-[0.12em] text-sf-text-muted">
        {label}
      </p>
      <span
        className={`flex size-6 shrink-0 items-center justify-center rounded-md ${TONE[tone].soft}`}
      >
        <Icon className="size-3" strokeWidth={1.9} />
      </span>
    </div>
    <div className="mt-3">
      <p
        className={`text-[23px] font-semibold leading-none tracking-[-0.035em] tabular-nums ${
          valueTone ? TONE[valueTone].text : "text-sf-text"
        }`}
      >
        {value}
      </p>
      {context ? (
        <p className="mt-2 text-[11px] leading-relaxed text-sf-text-muted">
          {context}
        </p>
      ) : null}
    </div>
  </article>
);

/* ------------------------------------------------------------------ */
/* Content rows                                                        */
/* ------------------------------------------------------------------ */

export const KeyValueList = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => (
  <dl className={`divide-y divide-sf-border-faint px-4 sm:px-5 ${className}`}>
    {children}
  </dl>
);

export const KeyValue = ({
  label,
  children,
  mono = false,
  tone,
}: {
  label: string;
  children: ReactNode;
  mono?: boolean;
  tone?: Tone;
}) => (
  <div className="grid grid-cols-[minmax(120px,0.75fr)_minmax(0,1.25fr)] items-start gap-5 py-3.5">
    <dt className="shrink-0 text-[13px] text-sf-text-muted">{label}</dt>
    <dd
      className={`min-w-0 break-words text-right text-[13px] font-medium leading-relaxed ${
        tone ? TONE[tone].text : "text-sf-text"
      } ${mono ? "font-mono" : "tabular-nums"}`}
    >
      {children}
    </dd>
  </div>
);

export const Pill = ({
  tone = "neutral",
  dot = false,
  children,
}: {
  tone?: Tone;
  dot?: boolean;
  children: ReactNode;
}) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${TONE[tone].pill}`}
  >
    {dot ? <span className={`size-1.5 rounded-full ${TONE[tone].solid}`} /> : null}
    {children}
  </span>
);

export const PreviewBadge = ({ label = "Preview" }: { label?: string }) => (
  <Pill tone="info">{label}</Pill>
);

/** Tinted lead banner inside a panel (verdict + one-line explanation). */
export const StatusBanner = ({
  tone,
  icon: Icon,
  title,
  description,
}: {
  tone: Tone;
  icon?: LucideIcon;
  title: ReactNode;
  description?: ReactNode;
}) => {
  const Glyph = Icon ?? TONE_ICON[tone];
  return (
    <div
      className={`flex items-center gap-3 border-b border-sf-border-faint px-4 py-4 sm:px-5 ${TONE[tone].tint}`}
    >
      <span
        className={`flex size-8 shrink-0 items-center justify-center rounded-md border ${TONE[tone].pill}`}
      >
        <Glyph className="size-4" strokeWidth={1.9} />
      </span>
      <div className="min-w-0 flex-1">
        <p className={`text-xs font-semibold leading-relaxed ${TONE[tone].text}`}>
          {title}
        </p>
        {description ? (
          <p className="mt-1 text-[11px] leading-relaxed text-sf-text-muted">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
};

/** Pass / Warn / Fail style row used by validation + config-finding lists. */
export const CheckRow = ({
  tone,
  title,
  description,
  status,
}: {
  tone: Tone;
  title: ReactNode;
  description?: ReactNode;
  status?: ReactNode;
}) => {
  const Icon = TONE_ICON[tone];
  return (
    <div className="flex items-center gap-3.5 py-3.5">
      <span
        className={`flex size-6 shrink-0 items-center justify-center rounded-full border ${TONE[tone].pill}`}
      >
        <Icon className="size-3.5" strokeWidth={2} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-medium text-sf-text">{title}</p>
        {description ? (
          <p className="mt-1 text-xs leading-relaxed text-sf-text-muted">
            {description}
          </p>
        ) : null}
      </div>
      {status ? (
        <span className={`shrink-0 text-xs font-medium ${TONE[tone].text}`}>
          {status}
        </span>
      ) : null}
    </div>
  );
};

/** Horizontal-scroll wrapper for the data tables. */
export const TableScroll = ({ children }: { children: ReactNode }) => (
  <div className="overflow-x-auto">{children}</div>
);

/* ------------------------------------------------------------------ */
/* Page scaffolding — asymmetric layout + dense status header          */
/* ------------------------------------------------------------------ */

/**
 * Primary/aside split used across the detail tabs. The primary column carries
 * the charts, tables, and findings; the aside carries metadata, config, and
 * schedule. Collapses to a single stack below `lg`.
 */
export const SplitLayout = ({
  main,
  aside,
}: {
  main: ReactNode;
  aside: ReactNode;
}) => (
  <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)] xl:grid-cols-[minmax(0,1fr)_minmax(0,384px)]">
    <div className="min-w-0 space-y-4">{main}</div>
    <div className="min-w-0 space-y-4">{aside}</div>
  </div>
);

export type HeaderStat = {
  label: string;
  value: ReactNode;
  tone?: Tone;
  hint?: ReactNode;
};

/**
 * Dense monitor header: identity + live status on the left, a divided strip of
 * key stats on the right. Replaces the generic "hero + 4 KPI cards" block with
 * a single compact bar that reads like a real product dashboard.
 */
export const MonitorHeader = ({
  icon: Icon,
  tone,
  title,
  status,
  target,
  meta,
  stats,
}: {
  icon: LucideIcon;
  tone: Tone;
  title: string;
  status: ReactNode;
  target?: ReactNode;
  meta?: ReactNode;
  stats: HeaderStat[];
}) => (
  <Panel className="bg-sf-surface">
    <div className="relative">
      <span
        className={`absolute bottom-5 left-0 top-5 w-0.5 rounded-full ${TONE[tone].solid}`}
        aria-hidden="true"
      />
      <div className="flex flex-col gap-5 px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-start gap-3.5">
          <span
            className={`flex size-10 shrink-0 items-center justify-center rounded-lg border ${TONE[tone].pill}`}
          >
            <Icon className="size-[18px]" strokeWidth={1.8} />
          </span>
          <div className="min-w-0">
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-sf-text-muted">
              Infrastructure health
            </p>
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-xl font-semibold tracking-[-0.03em] text-sf-text">
                {title}
              </h2>
              {status}
            </div>
            {target ? (
              <p className="mt-1.5 font-mono text-xs text-sf-text-sub">
                {target}
              </p>
            ) : null}
            {meta ? (
              <p className="mt-1.5 text-xs leading-relaxed text-sf-text-muted">
                {meta}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
    <dl className="grid border-t border-sf-border-faint sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className={`px-5 py-4 sm:px-6 ${
            index > 0 ? "border-t border-sf-border-faint" : ""
          } ${
            index === 1 ? "sm:border-t-0" : ""
          } sm:odd:border-r sm:odd:border-sf-border-faint xl:border-t-0 xl:border-r xl:border-sf-border-faint xl:last:border-r-0`}
        >
          <dt className="text-[10px] font-semibold uppercase tracking-[0.11em] text-sf-text-muted">
            {stat.label}
          </dt>
          <dd
            className={`mt-2 text-xl font-semibold leading-none tracking-[-0.03em] tabular-nums ${
              stat.tone ? TONE[stat.tone].text : "text-sf-text"
            }`}
          >
            {stat.value}
          </dd>
          {stat.hint ? (
            <dd className="mt-1.5 text-xs text-sf-text-muted">{stat.hint}</dd>
          ) : null}
        </div>
      ))}
    </dl>
  </Panel>
);

/** Compact metric cell for use inside panels (a denser KpiCard). */
export const MiniStat = ({
  label,
  value,
  unit,
  tone,
}: {
  label: ReactNode;
  value: ReactNode;
  unit?: string;
  tone?: Tone;
}) => (
  <div className="px-3 py-0.5 text-center">
    <p
      className={`text-xl font-semibold leading-none tracking-[-0.03em] tabular-nums ${
        tone ? TONE[tone].text : "text-sf-text"
      }`}
    >
      {value}
      {unit ? (
        <span className="ml-0.5 text-xs font-medium text-sf-text-muted">
          {unit}
        </span>
      ) : null}
    </p>
    <p className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.08em] text-sf-text-muted">
      {label}
    </p>
  </div>
);
