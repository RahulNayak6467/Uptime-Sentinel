import Link from "next/link";
import { monitorStatsProps } from "./types";

const MonitorStats = ({
  icon,
  label,
  href,
  number,
  backgroundColor,
  color,
  isActive,
  comingSoon,
}: monitorStatsProps) => {
  const Icon = icon;

  const content = (
    <div
      className={`relative flex min-h-9 w-full items-center justify-between overflow-hidden rounded-sf-sm transition-colors ${
        comingSoon
          ? "cursor-default opacity-50"
          : isActive
            ? "bg-sf-blue-bg text-sf-blue cursor-pointer before:absolute before:inset-y-1.5 before:left-0 before:w-0.5 before:rounded-full before:bg-sf-blue"
            : "hover:bg-sf-bg cursor-pointer"
      }`}
    >
      <div className="flex items-center gap-2.5 px-2.5 py-2">
        <Icon
          className={`h-4 w-4 transition-colors ${
            isActive && !comingSoon ? "text-sf-blue" : "text-sf-text-muted"
          }`}
        />
        <p
          className={`text-sf-label font-medium tracking-wide transition-colors ${
            isActive && !comingSoon ? "font-semibold text-sf-blue" : "text-sf-text-sub"
          }`}
        >
          {label}
        </p>
      </div>
      {comingSoon ? (
        <span className="mr-2 text-[10px] font-semibold font-sans px-1.5 py-0.5 rounded-full bg-sf-bg text-sf-text-muted tracking-wide">
          Soon
        </span>
      ) : (
        <div
          className="h-4 w-4 mr-2 flex items-center justify-center rounded-full"
          style={{
            color: color ?? "",
            background: backgroundColor ?? "",
          }}
        >
          <span className="text-[10px]">{number}</span>
        </div>
      )}
    </div>
  );

  if (comingSoon) return content;

  return <Link href={href}>{content}</Link>;
};

export default MonitorStats;
