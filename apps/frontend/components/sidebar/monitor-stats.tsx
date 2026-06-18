import { monitorStatsProps } from "./types";

const MonitorStats = ({
  icon,
  label,
  number,
  backgroundColor,
  color,
  isActive,
  onClick,
  comingSoon,
}: monitorStatsProps) => {
  const Icon = icon;
  return (
    <div
      onClick={comingSoon ? undefined : onClick}
      className={`flex justify-between items-center w-full rounded-sm transition-colors ${
        comingSoon
          ? "cursor-default opacity-50"
          : isActive
            ? "bg-gray-200 cursor-pointer"
            : "hover:bg-gray-100 cursor-pointer"
      }`}
    >
      <div className="flex gap-2 items-center px-2 py-1">
        <Icon
          className={`h-4 w-4 transition-colors ${
            isActive && !comingSoon ? "text-sf-text" : "text-gray-500"
          }`}
        />
        <p
          className={`text-sf-label font-medium tracking-wide transition-colors ${
            isActive && !comingSoon ? "text-sf-text" : "text-sf-text-sub"
          }`}
        >
          {label}
        </p>
      </div>
      {comingSoon ? (
        <span className="mr-2 text-[10px] font-semibold font-sans px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-400 tracking-wide">
          Soon
        </span>
      ) : (
        <div
          className="h-4 w-4 mr-2 flex items-center justify-center rounded-full"
          style={{
            color: color ? color : "",
            background: backgroundColor ? backgroundColor : "",
          }}
        >
          <span className="text-[10px]">{number}</span>
        </div>
      )}
    </div>
  );
};

export default MonitorStats;
