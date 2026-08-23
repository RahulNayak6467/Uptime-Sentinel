"use client";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { allMonitorsDataDashboardViewProps } from "@/features/Overview/types";

export const useFilter = (
  monitorStatus: string,
  page: number,
  limit: number,
) => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["all monitors data by status", monitorStatus, page],
    queryFn: () =>
      apiFetch<allMonitorsDataDashboardViewProps>(
        `/monitors/data?monitorstatus=${monitorStatus}&page=${page}&limit=${limit}`,
      ),
    staleTime: 60,
    placeholderData: (prev) => prev,
  });
  return { data, isLoading, isError, refetch };
};
