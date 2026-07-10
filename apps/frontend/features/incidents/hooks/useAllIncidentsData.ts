"use client";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { IncidentsPaginatedData } from "../types";

export const useAllIncidentsData = (limit: number, page: number) => {
  const { data, isLoading, isFetching, isError, refetch } = useQuery({
    queryKey: ["incidents data timeline", limit, page],
    queryFn: () =>
      apiFetch<IncidentsPaginatedData>(
        `/incidents?limit=${limit}&page=${page}`,
      ),
    placeholderData: (prev) => prev,
  });
  return { data, isLoading, isFetching, isError, refetch };
};
