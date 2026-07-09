"use client";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { IncidentTypeTimelineProps } from "../types";

export const useIncidentsTimeline = (limit: number, page: number) => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["incidents type timeline", limit, page],
    queryFn: () =>
      apiFetch<IncidentTypeTimelineProps>(
        `/incidents/timeline?limit=${limit}&page=${page}`,
      ),
    // placeholderData: (prev) => prev,
  });
  return { data, isLoading, isError, refetch };
};
