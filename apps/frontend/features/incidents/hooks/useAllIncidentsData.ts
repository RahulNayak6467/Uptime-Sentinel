"use client";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { IncidentsPaginatedData } from "../types";
import { IncidentStatusFilter } from "../types";

export const useAllIncidentsData = (
  limit: number,
  page: number,
  status: IncidentStatusFilter = "all",
) => {
  const { data, isLoading, isFetching, isError, refetch } = useQuery({
    queryKey: ["incidents data timeline", limit, page, status],
    queryFn: () =>
      apiFetch<IncidentsPaginatedData>(
        `/incidents?limit=${limit}&page=${page}&status=${status}`,
      ),
    placeholderData: (prev) => prev,
  });
  return { data, isLoading, isFetching, isError, refetch };
};
