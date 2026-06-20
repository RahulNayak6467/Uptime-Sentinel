import { OverviewStatsProps } from "./types";

const OverviewStatsCard = ({
  metric,
  value,
  context,
  color,
}: OverviewStatsProps) => {
  return (
    <div className="px-3 py-3 flex-1 flex flex-col border-r border-b border-sf-border bg-sf-surface hover:bg-sf-bg transition-colors">
      <p className="text-[10px] font-semibold font-sans text-sf-text-muted tracking-widest uppercase">
        {metric}
      </p>
      <p
        className="text-2xl font-bold font-sans leading-tight"
        style={{ color }}
      >
        {value}
      </p>
      <p className="text-[12px] font-sans text-sf-text-muted">{context}</p>
    </div>
  );
};

export default OverviewStatsCard;
