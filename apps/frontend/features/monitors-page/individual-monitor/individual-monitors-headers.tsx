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
    <header className="flex items-center justify-between px-6 py-3 border-b border-sf-border bg-sf-surface">
      <div className="flex flex-col gap-1.5 min-w-0">
        <Link
          href="/dashboard/monitors"
          className="flex items-center gap-1 w-fit text-[12px] font-sans font-medium text-sf-text-muted hover:text-sf-text transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Monitors
        </Link>
        <div className="flex items-center gap-2.5 min-w-0">
          <span style={{backgroundColor: monitorOverviewData.isActive ? "#16a34a" : "#dc2626"}} className="w-2 h-2 rounded-full shrink-0" />
          <h1 className="text-[16px] font-bold text-sf-text truncate">
            {monitorOverviewData.urlName}
          </h1>
          <span style={{color:monitorOverviewData.isActive ? "#16a34a" : "#dc2626",borderColor: monitorOverviewData.isActive?"#bbf7d04D":"#fecaca4D"}} className="text-[11px] font-semibold font-sans border  rounded-md px-2 py-0.5 shrink-0">
            {monitorOverviewData.isActive ? "Operational" : "Not operational"}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button onClick={() => onResumeUpdate()} className="flex items-center gap-1.5 px-4 py-1.5 text-[13px] font-semibold text-sf-text border border-sf-border rounded-sf hover:border-sf-text-muted hover:b
        g-sf-bg hover:-translate-y-0.5 hover:shadow-sm transition-all duration-200 cursor-pointer">
      <Play className="w-3.5 h-3.5" />
          Resume
        </button>
        <button onClick={() => onPauseUpdate()} className="flex items-center gap-1.5 px-4 py-1.5 text-[13px] font-semibold text-sf-text border border-sf-border rounded-sf hover:border-sf-text-muted hover:b
          g-sf-bg hover:-translate-y-0.5 hover:shadow-sm transition-all duration-200 cursor-pointer">
          <Pause className="w-3.5 h-3.5" />
          Pause
        </button>
        <button className="flex items-center gap-1.5 px-4 py-1.5 text-[13px] font-semibold text-sf-text border border-sf-border rounded-sf hover:border-sf-text-muted hover:b
        g-sf-bg hover:-translate-y-0.5 hover:shadow-sm transition-all duration-200 cursor-pointer">
        <Edit className="w-3.5 h-3.5" />
          Edit
        </button>
      </div>
    </header>
  );
};

export default IndividualMonitorsHeaders;
