"use client";
import { useQuery } from "@tanstack/react-query";
import { apiFetch, ApiDataResponse } from "@/lib/api";
import { TlsHistoryResponse } from "@/features/monitors-page/individual-monitor/types";

export const useTlsHistory = (id: string) => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["monitor", id, "tls", "history"],
    queryFn: () =>
      apiFetch<ApiDataResponse<TlsHistoryResponse>>(
        `/monitors/${id}/tls/history`,
      ).then((res) => res.data),
  });

  return { data, isLoading, isError, refetch };
};
