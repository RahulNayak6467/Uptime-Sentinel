import { useQuery } from "@tanstack/react-query";
import { apiFetch, ApiDataResponse } from "@/lib/api";
import {
  TimeRangeDataProps,
  TimeRangeProps,
} from "@/features/monitors-page/individual-monitor/types";

export const useTimeRange = (id: string, timeRange: TimeRangeProps) => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["monitor", id, "charts", timeRange],
    queryFn: () =>
      apiFetch<ApiDataResponse<TimeRangeDataProps>>(
        `/monitors/${id}/response-time?range=${timeRange}`,
      ),
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true,
    placeholderData: (prev) => prev,
  });

  return { data, isLoading, isError, refetch };
};
