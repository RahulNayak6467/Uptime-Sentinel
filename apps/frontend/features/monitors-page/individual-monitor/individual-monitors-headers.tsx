"use client"
import { useState } from "react";
import { ChevronLeft, Edit, Pause, Play } from "lucide-react";
import Link from "next/link";
import {IndividualOverviewStatsProps} from "@/features/monitors-page/individual-monitor/types";
import {HeaderSkeleton, HeaderError} from "./monitor-overview-states";
import {usePause, useResume} from "@/features/monitors-page/individual-monitor/hooks/useActive";
;
import {ApiError} from "@/lib/api-error";
import {toast} from "sonner";
import { EditMonitorModal } from "./edit-monitor-modal/edit-monitor-modal";

const IndividualMonitorsHeaders = ({id,monitorOverviewData,monitorOverviewLoading,monitorOverviewError}:{id:string,monitorOverviewData: NoInfer<IndividualOverviewStatsProps> | undefined,monitorOverviewLoading:boolean,monitorOverviewError:boolean}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const {mutate:pauseUrlMutate} = usePause()

  const {mutate:resumeUrlMutate} = useResume()

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

  const statusMeta = !monitorOverviewData.isActive
    ? {
        label: "Paused",
        dot: "bg-sf-text-muted",
        badge: "border-sf-border bg-sf-bg text-sf-text-muted",
      }
    : monitorOverviewData.status === "UP"
      ? {
          label: "Operational",
          dot: "bg-sf-green",
          badge: "border-sf-green-border bg-sf-green-bg text-sf-green",
        }
      : monitorOverviewData.status === "DOWN"
        ? {
            label: "Down",
            dot: "bg-sf-red",
            badge: "border-sf-red-border bg-sf-red-bg text-sf-red",
          }
        : {
            label: "Pending first check",
            dot: "bg-sf-amber",
            badge: "border-sf-amber-border bg-sf-amber-bg text-sf-amber",
          };

  return (
    <>
    <header className="sf-page-header">
      <div className="flex min-w-0 flex-col gap-1.5">
        <Link
          href="/dashboard/monitors"
          className="flex w-fit items-center gap-1 font-sans text-xs font-medium text-sf-text-muted transition-colors hover:text-sf-text"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Monitors
        </Link>
        <div className="flex items-center gap-2.5 min-w-0">
          <span className={`size-2 shrink-0 rounded-full ${statusMeta.dot}`} />
          <h1 className="truncate text-xl font-semibold tracking-sf-tight text-sf-text">
            {monitorOverviewData.urlName}
          </h1>
          <span className={`shrink-0 rounded-sf border px-2.5 py-0.5 text-xs font-semibold ${statusMeta.badge}`}>
            {statusMeta.label}
          </span>
        </div>
      </div>
      <div className="flex w-full flex-wrap items-center gap-2 md:w-auto md:shrink-0">
        {monitorOverviewData.isActive ? (
          <button onClick={() => onPauseUpdate()} className="flex h-9 flex-1 cursor-pointer items-center justify-center gap-2 rounded-[4px] border border-sf-border bg-sf-surface px-4 text-xs font-semibold text-sf-text transition-colors hover:border-sf-amber hover:bg-sf-amber-bg hover:text-sf-amber focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sf-amber/25 sm:flex-none">
            <Pause className="size-3.5" />
            Pause monitor
          </button>
        ) : (
          <button onClick={() => onResumeUpdate()} className="flex h-9 flex-1 cursor-pointer items-center justify-center gap-2 rounded-[4px] bg-sf-text px-4 text-xs font-semibold text-sf-btn-text shadow-sm transition-colors hover:bg-sf-green hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sf-green/25 sm:flex-none">
            <Play className="size-3.5" />
            Resume monitor
          </button>
        )}
        <button
          type="button"
          onClick={() => setIsEditModalOpen(true)}
          className="flex h-9 flex-1 cursor-pointer items-center justify-center gap-2 rounded-[4px] border border-sf-border bg-sf-surface px-4 text-xs font-semibold text-sf-text transition-colors hover:bg-sf-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sf-blue/25 sm:flex-none"
        >
          <Edit className="size-3.5" />
          Edit
        </button>
      </div>
    </header>
    {isEditModalOpen && (
      <EditMonitorModal
        monitor={monitorOverviewData}
        onClose={() => setIsEditModalOpen(false)}
      />
    )}
    </>
  );
};

export default IndividualMonitorsHeaders;
