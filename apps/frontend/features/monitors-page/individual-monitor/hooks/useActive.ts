import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { IndividualOverviewStatsProps } from "../types";

export const usePause = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (id: string) =>
      apiFetch<null>(`/monitors/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ isActive: false }),
      }),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({
        queryKey: ["monitor", id, "overview data"],
      });

      const previousData = queryClient.getQueryData([
        "monitor",
        id,
        "overview data",
      ]);
      queryClient.setQueryData(
        ["monitor", id, "overview data"],
        (oldData: IndividualOverviewStatsProps) => {
          return { ...oldData, isActive: false };
        },
      );

      return { previousData };
    },
    onError: (_err, id, ctx) => {
      queryClient.setQueryData(
        ["monitor", id, "overview data"],
        ctx?.previousData,
      );
    },
    onSettled: (_data, _error, id) => {
      queryClient.invalidateQueries({
        queryKey: ["monitor", id, "overview data"],
      });
    },
    retry: false,
  });

  return { mutate, isPending };
};

export const useResume = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (id: string) =>
      apiFetch<null>(`/monitors/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ isActive: true }),
      }),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({
        queryKey: ["monitor", id, "overview data"],
      });

      const previousData = queryClient.getQueryData([
        "monitor",
        id,
        "overview data",
      ]);
      queryClient.setQueryData(
        ["monitor", id, "overview data"],
        (oldData: IndividualOverviewStatsProps) => {
          return { ...oldData, isActive: true };
        },
      );

      return { previousData };
    },
    onError: (_err, id, ctx) => {
      queryClient.setQueryData(
        ["monitor", id, "overview data"],
        ctx?.previousData,
      );
    },
    onSettled: (_data, _error, id) => {
      queryClient.invalidateQueries({
        queryKey: ["monitor", id, "overview data"],
      });
    },
    retry: false,
  });

  return { mutate, isPending };
};
