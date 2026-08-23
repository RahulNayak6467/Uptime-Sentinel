"use client"
import { useQuery } from "@tanstack/react-query";
import { apiFetch, ApiDataResponse } from "@/lib/api";
import { editConfigMonitorProps } from "../types";

export const useEditConfig = (monitorId: string) => {
    const {data, isLoading,isError, refetch} = useQuery({
        queryKey: ["monitor",monitorId,"edit config"],
        queryFn: () =>
        apiFetch<ApiDataResponse<editConfigMonitorProps>>(`/monitors/${monitorId}/edit-options`).then((res) => res.data)
    })
    return {data,isLoading,isError,refetch}
}
