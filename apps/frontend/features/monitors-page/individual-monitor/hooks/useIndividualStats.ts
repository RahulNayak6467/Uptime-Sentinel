"use client"
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import {IndividualStatsCardState} from "@/features/monitors-page/individual-monitor/types";


export const useIndividualStats = (id:string) => {
    const {data, isLoading,isError, refetch} = useQuery({
        queryKey: ["monitor",id,"stats"],
        queryFn: () => apiFetch<IndividualStatsCardState>(`/monitors/${id}/stats`),
    })
    return {data,isLoading,isError,refetch}
}
