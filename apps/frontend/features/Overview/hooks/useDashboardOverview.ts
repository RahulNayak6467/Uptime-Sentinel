"use client"
import { useQuery } from "@tanstack/react-query";
import { apiFetch, ApiDataResponse } from "@/lib/api";
import {DashboardOverviewResponse} from "@/features/Overview/types";

export const useDashboardOverview = () => {
    const {data, isLoading,isError, isFetching, refetch, dataUpdatedAt} = useQuery({
        queryKey: ["dashboardOverview"],
        queryFn: () =>
            apiFetch<ApiDataResponse<DashboardOverviewResponse>>("/dashboard/overview").then((res) => res.data)
    })
    return {data,isLoading,isError,isFetching,refetch,dataUpdatedAt}
}
