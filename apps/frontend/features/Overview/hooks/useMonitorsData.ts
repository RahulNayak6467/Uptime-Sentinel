"use client"
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import {allMonitorsDataDashboardViewProps} from "@/features/Overview/types";

export const useAllMonitorsData = () => {
    const {data, isLoading,isError, refetch} = useQuery({
        queryKey: ["all monitors overview data"],
        queryFn: () => apiFetch<allMonitorsDataDashboardViewProps[]>("/monitor/data")
    })
    return {data,isLoading,isError,refetch}
}