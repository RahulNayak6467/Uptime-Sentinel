import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { TimeRangeProps } from "../types";

export const useSSEIndividualMonitorData = (
  id: string,
  timeRange: TimeRangeProps,
) => {
  const queryClient = useQueryClient();
  useEffect(() => {
    const backendSSEUrl =
      process.env.NEXT_PUBLIC_SSE_ENDPOINT ??
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

      queryClient.invalidateQueries({
        queryKey: ["monitor", id, "charts", timeRange],
      });
    });

    return () => sources.close();
  }, [queryClient, id, timeRange]);
};
