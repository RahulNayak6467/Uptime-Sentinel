import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { RecentAlerts } from "@/features/integrations/email-alerts/types";

export const useRecentAlerts = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["monitor recent alerts"],
    queryFn: () => apiFetch<RecentAlerts>(`/alert-email`),
  });

  return { data, isLoading, isError, refetch };
};
