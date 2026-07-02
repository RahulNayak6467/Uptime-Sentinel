import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { allMonitorsDataDashboardViewProps } from "../types";

export const useSSEMonitors = (page: number) => {
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
        ["all monitors overview data", page],
        (oldData: allMonitorsDataDashboardViewProps) => {
          const monitorTablesData = oldData.data;
          const updatedData = monitorTablesData.map((el) => {
            if (el.id === monitorData.monitorId) {
              return {
                ...el,
                status: monitorData.status,
                statusCode: monitorData.statusCode,
                nextCheckAt: monitorData.nextCheckAt,
              };
            } else {
              return { ...el };
            }
          });

          queryClient.invalidateQueries({ queryKey: ["dashboardOverview"] });

          return { data: updatedData, pagination: oldData.pagination };
        },
      );
    });

    return () => sources.close();
  }, [queryClient, page]);
};
