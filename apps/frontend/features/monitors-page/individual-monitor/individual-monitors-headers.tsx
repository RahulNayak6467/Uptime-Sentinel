"use client"
import { ChevronLeft, Edit, Pause, Play } from "lucide-react";
import Link from "next/link";
import {IndividualOverviewStatsProps} from "@/features/monitors-page/individual-monitor/types";
import {HeaderSkeleton, HeaderError} from "./monitor-overview-states";
import {usePause, useResume} from "@/features/monitors-page/individual-monitor/hooks/useActive";
;
import {ApiError} from "@/lib/api-error";
import {toast} from "sonner";

const IndividualMonitorsHeaders = ({id,monitorOverviewData,monitorOverviewLoading,monitorOverviewError}:{id:string,monitorOverviewData: NoInfer<IndividualOverviewStatsProps> | undefined,monitorOverviewLoading:boolean,monitorOverviewError:boolean}) => {

  const {mutate:pauseUrlMutate,isPending:pauseUrlIsPending} = usePause()

  const {mutate:resumeUrlMutate,isPending:resumeUrlIsPending} = useResume()

  const onPauseUpdate = () => {

    pauseUrlMutate(id, {
      onSuccess: () => {
        toast.success("Url successfully paused");
      },
      onError: (err) => {
        if (err instanceof ApiError) {
          toast.error(err.message);
        } else {
          toast.error("Something went wrong. Please try again.");
        }
      },
    });
  }
    const onResumeUpdate = () => {

      resumeUrlMutate(id, {
        onSuccess: () => {
          toast.success("Url successfully resumed");
        },
        onError: (err) => {
          if (err instanceof ApiError) {
            toast.error(err.message);
          } else {
            toast.error("Something went wrong. Please try again.");
          }
        },
      });
    }

  if(monitorOverviewLoading){
    return <HeaderSkeleton />
  }

  if(monitorOverviewError || !monitorOverviewData){
    return <HeaderError />
  }

  return (
    <header className="sf-page-header">
      <div className="flex flex-col gap-1.5 min-w-0">
        <Link
          href="/dashboard/monitors"
          className="flex w-fit items-center gap-1 rounded-sf-sm px-1 py-0.5 font-sans text-[12px] font-medium text-sf-text-muted transition-colors hover:bg-sf-blue-bg hover:text-sf-blue"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Monitors
        </Link>
        <div className="flex items-center gap-2.5 min-w-0">
          <span style={{backgroundColor: monitorOverviewData.isActive ? "#16a34a" : "#dc2626"}} className="w-2 h-2 rounded-full shrink-0" />
          <h1 className="sf-page-title truncate">
            {monitorOverviewData.urlName}
          </h1>
          <span style={{color:monitorOverviewData.isActive ? "#16a34a" : "#dc2626",borderColor: monitorOverviewData.isActive?"#bbf7d04D":"#fecaca4D"}} className="text-[11px] font-semibold font-sans border  rounded-md px-2 py-0.5 shrink-0">
            {monitorOverviewData.isActive ? "Operational" : "Not operational"}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button onClick={() => onResumeUpdate()} className="flex cursor-pointer items-center gap-1.5 rounded-sf-sm border border-sf-border px-4 py-1.5 text-[13px] font-semibold text-sf-text transition-colors hover:border-sf-green hover:bg-sf-green-bg hover:text-sf-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sf-green/25">
      <Play className="w-3.5 h-3.5" />
          Resume
        </button>
        <button onClick={() => onPauseUpdate()} className="flex cursor-pointer items-center gap-1.5 rounded-sf-sm border border-sf-border px-4 py-1.5 text-[13px] font-semibold text-sf-text transition-colors hover:border-sf-amber hover:bg-sf-amber-bg hover:text-sf-amber focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sf-amber/25">
          <Pause className="w-3.5 h-3.5" />
          Pause
        </button>
        <button className="flex cursor-pointer items-center gap-1.5 rounded-sf-sm border border-sf-border px-4 py-1.5 text-[13px] font-semibold text-sf-text transition-colors hover:border-sf-blue hover:bg-sf-blue-bg hover:text-sf-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sf-blue/25">
        <Edit className="w-3.5 h-3.5" />
          Edit
        </button>
      </div>
    </header>
  );
};

export default IndividualMonitorsHeaders;
