import {useQuery} from "@tanstack/react-query";
import {apiFetch} from "@/lib/api";
import {IndividualOverviewStatsProps} from "@/features/monitors-page/individual-monitor/types";



export const useIndividualMonitorOverview = (id:string) => {
    const {data, isLoading,isError, refetch} = useQuery({
        queryKey: ["monitor",id,"overview data"],
        queryFn: () => apiFetch<IndividualOverviewStatsProps>(`/monitors/${id}/info`),
    })

    return {data, isLoading,isError, refetch};
}

