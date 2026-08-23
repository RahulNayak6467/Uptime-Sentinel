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
  "sf-panel group flex min-h-[132px] flex-col justify-between p-4 transition-colors duration-150";

const TONE_SOFT_CLASS = {
  blue: "text-sf-blue",
  green: "text-sf-green",
  amber: "text-sf-amber",
  red: "text-sf-red",
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
    <div className="flex items-center justify-between gap-2">
      <p className="flex min-w-0 items-center gap-1 truncate text-xs font-medium text-sf-text-muted">
        <span className="truncate">{metric}</span>
        {linked ? (
          <ArrowUpRight
            className="size-3 shrink-0 -translate-x-0.5 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
            strokeWidth={2.5}
          />
        ) : null}
      </p>
      <span className={`flex size-7 shrink-0 items-center justify-center rounded-[5px] border border-sf-border-faint bg-sf-bg ${TONE_SOFT_CLASS[tone]}`}>
        <Icon className="size-3.5" strokeWidth={1.8} />
      </span>
    </div>

    <div className="mt-2.5">
      <p
        className="text-[26px] font-semibold leading-none tracking-[-0.03em] tabular-nums"
        style={valueColor ? { color: valueColor } : undefined}
      >
        {value}
      </p>
      {context ? (
        <p className="mt-1.5 text-[11px] text-sf-text-muted">{context}</p>
      ) : null}
    </div>

    {footer !== undefined ? (
      <div className="mt-3 flex h-6 items-center">{footer}</div>
    ) : null}
  </>
);

const StatCard = (props: StatCardProps) => {
  if (props.href) {
    return (
      <Link href={props.href} className={`${CARD_CLASS} hover:border-sf-text-muted/45 hover:bg-sf-bg/20`}>
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
