import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { LastFiveIncidentDataProps } from "../types";

export const useLastFiveIncidentsData = (monitorId: string) => {
  const { data, isLoading, isError, isFetching, refetch } = useQuery({
    queryKey: ["monitor", monitorId, "incidents", "latest"],
    queryFn: () =>
      apiFetch<LastFiveIncidentDataProps>(`/incidents/${monitorId}/info`),
  });

  return { data, isLoading, isError, isFetching, refetch };
};
