import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type StatCardProps = {
  metric: string;
  icon: LucideIcon;
  value: ReactNode;
  valueColor?: string;
  context?: ReactNode;
  /** Optional footer visual — uptime bar, sparkline, etc. */
  footer?: ReactNode;
  /** When set the whole card becomes a link with a hover affordance. */
  href?: string;
  tone?: "blue" | "green" | "amber" | "red";
};

const CARD_CLASS =
  "sf-panel group relative flex min-h-[154px] overflow-hidden flex-col justify-between p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-sf-text-muted/40 hover:shadow-sf-card";

const TONE_CLASS = {
  blue: "bg-sf-blue",
  green: "bg-sf-green",
  amber: "bg-sf-amber",
  red: "bg-sf-red",
};

const TONE_SOFT_CLASS = {
  blue: "bg-sf-blue/10 text-sf-blue",
  green: "bg-sf-green/10 text-sf-green",
  amber: "bg-sf-amber/10 text-sf-amber",
  red: "bg-sf-red/10 text-sf-red",
};

const CardInner = ({
  metric,
  icon: Icon,
  value,
  valueColor,
  context,
  footer,
  linked = false,
  tone = "blue",
}: StatCardProps & { linked?: boolean }) => (
  <>
    <span className={`pointer-events-none absolute -right-7 -top-8 size-24 rounded-full ${TONE_CLASS[tone]} opacity-[0.055] blur-2xl`} />
    <div className="flex items-center justify-between gap-2">
      <p className="flex min-w-0 items-center gap-1 truncate text-[10px] font-bold uppercase tracking-[0.15em] text-sf-text-muted">
        <span className="truncate">{metric}</span>
        {linked ? (
          <ArrowUpRight
            className="size-3 shrink-0 -translate-x-0.5 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
            strokeWidth={2.5}
          />
        ) : null}
      </p>
      <span className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${TONE_SOFT_CLASS[tone]} transition-transform duration-200 group-hover:scale-105`}>
        <Icon className="size-4" strokeWidth={1.8} />
      </span>
    </div>

    <div className="mt-3">
      <p
        className="text-[29px] font-semibold leading-none tracking-[-0.035em] tabular-nums"
        style={valueColor ? { color: valueColor } : undefined}
      >
        {value}
      </p>
      {context ? (
        <p className="mt-2 text-xs text-sf-text-muted">{context}</p>
      ) : null}
    </div>

    {footer !== undefined ? (
      <div className="mt-3.5 flex h-7 items-center">{footer}</div>
    ) : null}
  </>
);

const StatCard = (props: StatCardProps) => {
  if (props.href) {
    return (
      <Link href={props.href} className={CARD_CLASS}>
        <CardInner {...props} linked />
      </Link>
    );
  }
  return (
    <div className={CARD_CLASS}>
      <CardInner {...props} />
    </div>
  );
};

export const NoData = () => (
  <span className="text-base font-medium text-sf-text-muted">No data</span>
);

export default StatCard;
