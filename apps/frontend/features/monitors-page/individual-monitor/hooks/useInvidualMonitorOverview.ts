import {useQuery} from "@tanstack/react-query";
import {apiFetch, ApiDataResponse} from "@/lib/api";
import {IndividualOverviewStatsProps} from "@/features/monitors-page/individual-monitor/types";



export const useIndividualMonitorOverview = (id:string) => {
    const {data, isLoading,isError, refetch} = useQuery({
        queryKey: ["monitor",id,"overview data"],
        queryFn: () =>
            apiFetch<ApiDataResponse<IndividualOverviewStatsProps>>(`/monitors/${id}/info`).then((res) => res.data),
    })

    return {data, isLoading,isError, refetch};
}
