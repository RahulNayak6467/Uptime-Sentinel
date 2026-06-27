"use client";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { allMonitorsDataDashboardViewProps } from "@/features/Overview/types";

export const useFilter = (monitorStatus: string) => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["all monitors data by status", monitorStatus],
    queryFn: () =>
      apiFetch<allMonitorsDataDashboardViewProps[]>(
        `/monitor/data?monitorstatus=${monitorStatus}`,
      ),
    staleTime: 60,
  });
  return { data, isLoading, isError, refetch };
};
