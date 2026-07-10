"use client";
import { useQuery } from "@tanstack/react-query";
import { apiFetch, ApiDataResponse } from "@/lib/api";
import { IncidentStatsCardInfoProps } from "../types";

export const useIncidentsStatsCard = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["incidents page stats card"],
    queryFn: () =>
      apiFetch<ApiDataResponse<IncidentStatsCardInfoProps>>(
        "/incidents/stats",
      ).then((res) => res.data),
  });
  return { data, isLoading, isError, refetch };
};
