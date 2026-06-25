type CheckTooltipProps = {
  status: "UP" | "DOWN" | null;
  responseTime: number | null;
  checkedAt: Date | string | null;
  // Set true to keep it always visible (for previewing the look without hovering).
  forceVisible?: boolean;
};

const formatCheckedAt = (value: Date | string | null) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
};

const CheckTooltip = ({
  status,
  responseTime,
  checkedAt,
  forceVisible = false,
}: CheckTooltipProps) => {
  const color =
    status === "UP" ? "var(--color-sf-green)" : "var(--color-sf-red)";
  const responseLabel =
    responseTime === null ? "No response" : `${responseTime}ms`;

  return (
    <div
      className={`pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-sf border border-sf-border bg-sf-surface px-2.5 py-1.5 text-left shadow-md ${
        forceVisible ? "block" : "hidden group-hover:block"
      }`}
    >
      <div
        className="flex items-center gap-1.5 text-[11px] font-semibold"
        style={{ color }}
      >
        <span
          className="inline-block h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: color }}
        />
        {status ?? "Unknown"}
      </div>
      <div className="text-[11px] font-medium text-sf-text">{responseLabel}</div>
      <div className="text-[10px] text-sf-text-muted">
        {formatCheckedAt(checkedAt)}
      </div>
    </div>
  );
};

export default CheckTooltip;
