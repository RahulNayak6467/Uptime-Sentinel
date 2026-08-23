"use client";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { IncidentStatusFilter, IncidentTypeTimelineProps } from "../types";

export const useIncidentsTimeline = (
  limit: number,
  page: number,
  status: IncidentStatusFilter = "all",
) => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["incidents type timeline", limit, page, status],
    queryFn: () =>
      apiFetch<IncidentTypeTimelineProps>(
        `/incidents/timeline?limit=${limit}&page=${page}&status=${status}`,
      ),
    // placeholderData: (prev) => prev,
  });
  return { data, isLoading, isError, refetch };
};
