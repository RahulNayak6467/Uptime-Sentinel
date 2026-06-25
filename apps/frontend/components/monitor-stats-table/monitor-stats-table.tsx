"use client"
import { columns } from "./columns";
import { servicesStatus } from "./data";
import { DataTable } from "./data-table";
import {useDashboardOverview} from "@/features/Overview/hooks/useDashboardOverview";
import Loader from "@/features/Overview/components/loading";
import Error from "@/features/Overview/components/error";
import {useMonitorsData} from "@/features/Overview/hooks/useMonitorsData";

const MonitorStatsTable = () => {
    const {data:overviewDataMonitorsData,isLoading:MonitorDataLoading,isError:MonitorDataError,refetch:MonitorRefetch} = useMonitorsData()

    if(MonitorDataLoading){
        return <Loader />
    }

    if(MonitorDataError || !overviewDataMonitorsData){
        return <Error refetch={MonitorRefetch} />
    }

    console.log(overviewDataMonitorsData)

    const data = overviewDataMonitorsData.map((el) => {
        return {...el,next_check_at: "23days ago" ,  uptime: 99.99,    responseTime: 112,
            statusCode: 200,    trend: [
                0.4, 0.46, 0.52, 0.58, 0.62, 0.6, 0.54, 0.48, 0.42, 0.39, 0.43, 0.49,
                0.55, 0.6, 0.58, 0.52, 0.46, 0.42, 0.46, 0.52, 0.57, 0.6, 0.55, 0.49,
                0.44, 0.48,
            ],}
    })



    // url_name: string;
    // url: string;
    // uptime: number;
    // responseTime: number | null;
    // statusCode: number | null;
    // interval_seconds: number;
    // next_check_at: string;
    // status: MonitorState;
    // trend: number[]

    return (
    <div className="px-6 py-4">
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default MonitorStatsTable;
