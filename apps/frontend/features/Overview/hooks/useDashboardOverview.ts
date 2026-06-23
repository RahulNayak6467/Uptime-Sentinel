"use client"
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import {DashboardOverviewResponse} from "@/features/Overview/types";

export const useDashboardOverview = () => {
    const {data, isLoading,isError, refetch} = useQuery({
        queryKey: ["dashboardOverview"],
        queryFn: () => apiFetch<DashboardOverviewResponse>("/dashboard/overview/stats")
    })
    return {data,isLoading,isError,refetch}
}