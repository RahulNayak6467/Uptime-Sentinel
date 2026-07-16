import { apiFetch } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editConfigMonitorProps, IndividualOverviewStatsProps } from "../types";

export const useEditMonitorConfig = (monitorId: string) => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (editMonitorProps: editConfigMonitorProps) =>
      apiFetch<null>(`/monitors/${monitorId}/update`, {
        method: "PATCH",
        body: JSON.stringify(editMonitorProps),
      }),
  })
  return { mutate, isPending };
}
