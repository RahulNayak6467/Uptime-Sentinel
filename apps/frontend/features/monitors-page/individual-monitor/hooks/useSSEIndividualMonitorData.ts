import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import {
  IndividualStatsCardState,
  TimeRangeDataProps,
  TimeRangeProps,
} from "../types";

export const useSSEIndividualMonitorData = (
  id: string,
  timeRange: TimeRangeProps,
) => {
  const queryClient = useQueryClient();
  useEffect(() => {
    const backendSSEUrl =
      process.env.NEXT_BACKEND_SSE_ENDPOINT ??
      "http://localhost:5000/sse/events";

    const sources = new EventSource(backendSSEUrl, {
      withCredentials: true,
    });

    sources.onopen = () => {
      console.log("SSE connection is opened");
    };

    sources.onerror = (err) => {
      console.log(err);
      console.log("Error in SSE connection");
    };

    sources.addEventListener("check_result", (event) => {
      const monitorData = JSON.parse(event.data);
      console.log(monitorData);

      queryClient.setQueryData(
        ["monitor", id, "charts", timeRange],
        (oldData: TimeRangeDataProps) => {
          // const chartData = oldData.series;
          // const updatedData = chartData.push({
          //   p50:
          // })
          // console.log("OLD DATA:", oldData);
          // const chartData = oldData.series["p50"];
          // const updatedData: IndividualStatsCardState = {
          //   ...chartData,
          //   avg_response_24hr: chartData,
          //   uptime_24hr: oldData.uptime_24hr,
          //   uptime_7d: oldData.uptime_7d,
          //   uptime_30d: oldData.uptime_30d,
          // };
          // console.log("CHART DATA", chartData);
          // return chartData;
        },
      );
    });

    return () => sources.close();
  }, [queryClient, id, timeRange]);
};
