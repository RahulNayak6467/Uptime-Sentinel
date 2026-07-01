import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { RecentAlerts } from "@/features/integrations/email-alerts/types";

export const useRecentAlerts = (page: number, limit: number) => {
  const { data, isLoading, isFetching, isPlaceholderData, isError, refetch } =
    useQuery({
      queryKey: ["monitor recent alerts", page],
      queryFn: () =>
        apiFetch<RecentAlerts>(`/alert-email?page=${page}&limit=${limit}`),
      placeholderData: (prev) => prev,
    });

  return { data, isLoading, isFetching, isPlaceholderData, isError, refetch };
};
