import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch, ApiDataResponse } from "@/lib/api";
import {
  IncidentAddDataProps,
  IncidentDataAddPayload,
  IncidentDataUpdatesPayload,
} from "../types";

export const useIncidentAdd = (incidentId: string) => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (payload: IncidentDataAddPayload) =>
      apiFetch<ApiDataResponse<IncidentAddDataProps>>(
        `/incidents/${incidentId}/updates`,
        {
        method: "POST",
        body: JSON.stringify(payload),
        },
      ).then((res) => res.data),
    retry: false,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["incidents type timeline"] }),
  });

  return { mutate, isPending };
};

export const useIncidentUpdate = (incidentId: string) => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (payload: IncidentDataUpdatesPayload) =>
      apiFetch<ApiDataResponse<IncidentAddDataProps>>(
        `/incidents/${incidentId}/updates`,
        {
        method: "PATCH",
        body: JSON.stringify(payload),
        },
      ).then((res) => res.data),
    retry: false,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["incidents type timeline"] }),
  });

  return { mutate, isPending };
};
