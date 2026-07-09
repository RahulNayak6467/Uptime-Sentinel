"use client";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { IncidentStatsCardInfoProps } from "../types";

export const useIncidentsStatsCard = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["incidents page stats card"],
    queryFn: () => apiFetch<IncidentStatsCardInfoProps>("/incidents/all/stats"),
  });
  return { data, isLoading, isError, refetch };
};
