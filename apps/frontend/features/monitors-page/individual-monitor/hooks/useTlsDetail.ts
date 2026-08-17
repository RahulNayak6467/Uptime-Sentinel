"use client";
import { useQuery } from "@tanstack/react-query";
import { apiFetch, ApiDataResponse } from "@/lib/api";
import { TlsDetailResponse } from "@/features/monitors-page/individual-monitor/types";

export const useTlsDetail = (id: string) => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["monitor", id, "tls", "detail"],
    queryFn: () =>
      apiFetch<ApiDataResponse<TlsDetailResponse>>(`/monitors/${id}/tls`).then(
        (res) => res.data,
      ),
  });

  return { data, isLoading, isError, refetch };
};
