"use client";
import { useQuery } from "@tanstack/react-query";
import { apiFetch, ApiDataResponse } from "@/lib/api";
import {
  TlsHandshakeLatencyResponse,
  TlsLatencyRange,
} from "@/features/monitors-page/individual-monitor/types";

export const useTlsHandshakeLatency = (id: string, range: TlsLatencyRange) => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["monitor", id, "tls", "handshake-latency", range],
    queryFn: () =>
      apiFetch<ApiDataResponse<TlsHandshakeLatencyResponse>>(
        `/monitors/${id}/tls/handshake-latency?range=${range}`,
      ).then((res) => res.data),
    staleTime: 60 * 1000,
    placeholderData: (prev) => prev,
  });

  return { data, isLoading, isError, refetch };
};
