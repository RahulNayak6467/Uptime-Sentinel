import { useQuery } from "@tanstack/react-query";
import { apiFetch, ApiDataResponse } from "@/lib/api";

export function useHealth() {
  return useQuery({
    queryKey: ["health"],
    queryFn: () =>
      apiFetch<ApiDataResponse<{ message: string }>>("/health").then(
        (res) => res.data,
      ),
  });
}
