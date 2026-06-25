import {useQuery} from "@tanstack/react-query";
import {apiFetch} from "@/lib/api";
import {TimeRangeDataProps, TimeRangeProps} from "@/features/monitors-page/individual-monitor/types";

export const useTimeRange = (id:string,timeRange:TimeRangeProps) => {
    const {data, isLoading,isError, refetch} = useQuery({
        queryKey: ["monitor",id,"charts",timeRange],
        queryFn: () => apiFetch<TimeRangeDataProps>(`/monitors/${id}/response-time?range=${timeRange}`),
        staleTime: 60 * 1000,
        refetchOnWindowFocus: true,
    })

    return {data, isLoading,isError, refetch};
}

