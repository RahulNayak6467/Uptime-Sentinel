"use client"
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import {MonitorsDataProps} from "@/features/Overview/types";
// import {DashboardOverviewResponse} from "@/features/Overview/types";

export const useMonitorsData = () => {
    const {data, isLoading,isError, refetch} = useQuery({
        queryKey: ["monitorsData"],
        queryFn: () => apiFetch<MonitorsDataProps[]>("/url/checks/monitor/data")
    })
    return {data,isLoading,isError,refetch}
}