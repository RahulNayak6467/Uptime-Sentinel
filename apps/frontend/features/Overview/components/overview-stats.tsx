"use client";
import { OverviewData } from "../data";
import OverviewStatsCard from "./overview-stats-card";
import { useDashboardOverview } from "@/features/Overview/hooks/useDashboardOverview";

import Loader from "../components/loading";
import Error from "../components/error";

const OverviewStats = () => {
  const {
    data: overViewStatsData,
    isLoading,
    isError,
    refetch,
  } = useDashboardOverview();

  if (isLoading) {
    return <Loader />;
  }

  if (isError || !overViewStatsData) {
    return <Error refetch={refetch} />;
  }

  // console.log("Event");

  // events.addEventListener("check_result", (event) => {;
  // });

  console.log(overViewStatsData);

  return (
    <div className="flex ">
      {OverviewData.map((data) => (
        <OverviewStatsCard
          key={data.id}
          metric={data.metric}
          value={data.value}
          stats={overViewStatsData[data.value]}
          color={data.color}
          context={data.context}
          format={data.format}
        />
      ))}
    </div>
  );
};

export default OverviewStats;
