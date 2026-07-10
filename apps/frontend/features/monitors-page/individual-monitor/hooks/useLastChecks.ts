import {useQuery} from "@tanstack/react-query";
import {apiFetch, ApiDataResponse} from "@/lib/api";
import {LastChecksDataProps} from "@/features/monitors-page/individual-monitor/types";


export const useLastChecks = (id:string) => {
    const {data, isLoading,isError, refetch} = useQuery({
        queryKey: ["monitor",id,"Last checks"],
        queryFn: () =>
            apiFetch<ApiDataResponse<LastChecksDataProps>>(`/monitors/${id}/checks`).then((res) => res.data),
    })

    return {data, isLoading,isError, refetch};
}
