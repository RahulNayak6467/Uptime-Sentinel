import { OverviewData } from "./data";
import OverviewStatsCard from "./overview-stats-card";

const OverviewStats = () => {
  return (
    <div className="">
      <div className="flex ">
        {OverviewData.map((data) => (
          <OverviewStatsCard
            key={data.id}
            metric={data.metric}
            value={data.value}
            color={data.color}
            context={data.context}
          />
        ))}
      </div>
    </div>
  );
};

export default OverviewStats;
