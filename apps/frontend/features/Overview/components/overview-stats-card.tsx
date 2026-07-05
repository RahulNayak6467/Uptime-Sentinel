import { OverviewStatsProps } from "../types";

const OverviewStatsCard = ({
  metric,
  context,
  color,
    stats,
  format,
}: OverviewStatsProps) => {
  return (
    <div className="sf-panel flex min-h-28 flex-col justify-center px-4 py-4 transition-[border-color,box-shadow] hover:border-sf-text-muted/60 hover:shadow-sf-card">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-sf-text-muted">
        {metric}
      </p>
      <p
        className="mt-1 text-2xl font-semibold leading-tight tracking-sf-tight"
        style={{ color }}
      >
          {stats == null ? (
            <span className="text-lg">No Data</span>
          ) : format ? (
            format(stats)
          ) : (
            stats
          )}
      </p>
      <p className="text-[12px] font-sans text-sf-text-muted">{context}</p>
    </div>
  );
};

export default OverviewStatsCard;
