"use client"
import { useQuery } from "@tanstack/react-query";
import { apiFetch, ApiDataResponse } from "@/lib/api";
import {IndividualStatsCardState} from "@/features/monitors-page/individual-monitor/types";


export const useIndividualStats = (id:string) => {
    const {data, isLoading,isError, refetch} = useQuery({
        queryKey: ["monitor",id,"stats"],
        queryFn: () =>
        apiFetch<ApiDataResponse<IndividualStatsCardState>>(`/monitors/${id}/stats`)
          .then((res) => res.data),
    })
    return {data,isLoading,isError,refetch}
}
