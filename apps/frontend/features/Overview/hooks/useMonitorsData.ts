"use client";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { allMonitorsDataDashboardViewProps } from "@/features/Overview/types";

export const useAllMonitorsData = (page: number, limit: number) => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["all monitors overview data", page],
    queryFn: () =>
      apiFetch<allMonitorsDataDashboardViewProps>(
        `/monitors?limit=${limit}&page=${page}`,
      ),
    placeholderData: (prev) => prev,
  });
  return { data, isLoading, isError, refetch };
};
