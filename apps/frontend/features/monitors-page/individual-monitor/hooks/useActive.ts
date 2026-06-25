import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";

type patchResponseDataProps = {
    message: string
}

export const usePause = () => {
    const { mutate, isPending } = useMutation({
        mutationFn: (id:string) =>
            apiFetch<patchResponseDataProps>(`/monitor/${id}/pause`, {
                method: "PATCH",
            }),
        retry: false,
    });

    return { mutate, isPending };
};

export const useResume = () => {
    const {mutate, isPending} = useMutation({
        mutationFn: (id:string) =>
            apiFetch<patchResponseDataProps>(`/monitor/${id}/resume`, {
                method: "PATCH",
            }),
        retry: false,
    });

    return {mutate, isPending};
}