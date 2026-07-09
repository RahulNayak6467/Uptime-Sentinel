import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { IndividualOverviewStatsProps } from "../types";

type patchResponseDataProps = {
  message: string;
};

export const usePause = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (id: string) =>
      apiFetch<patchResponseDataProps>(`/monitor/${id}/pause`, {
        method: "PATCH",
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
      console.log("PREVIOUS DATA", previousData);
      queryClient.setQueryData(
        ["monitor", id, "overview data"],
        (oldData: IndividualOverviewStatsProps) => {
          return { ...oldData, isActive: false };
        },
      );
      console.log("UPDATED DATA", previousData);

      return { previousData };
    },
    onError: (_err, id, ctx) => {
      queryClient.setQueryData(
        ["monitor", id, "overview data"],
        ctx?.previousData,
      );
    },
    onSuccess: () => {
      console.log("Success");
    },
    onSettled: (_data, _error, id) => {
      console.log("Mutation Settled");
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
      apiFetch<patchResponseDataProps>(`/monitor/${id}/resume`, {
        method: "PATCH",
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
      console.log("PREVIOUS DATA", previousData);
      queryClient.setQueryData(
        ["monitor", id, "overview data"],
        (oldData: IndividualOverviewStatsProps) => {
          return { ...oldData, isActive: true };
        },
      );
      console.log("UPDATED DATA", previousData);

      return { previousData };
    },
    onError: (_err, id, ctx) => {
      queryClient.setQueryData(
        ["monitor", id, "overview data"],
        ctx?.previousData,
      );
    },
    onSuccess: () => {
      console.log("Success");
    },
    onSettled: (_data, _error, id) => {
      console.log(id);
      console.log("Mutation Settled");
      queryClient.invalidateQueries({
        queryKey: ["monitor", id, "overview data"],
      });
    },
    retry: false,
  });

  return { mutate, isPending };
};
