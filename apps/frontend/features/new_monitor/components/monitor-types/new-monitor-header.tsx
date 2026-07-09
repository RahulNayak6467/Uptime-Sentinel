import { ArrowLeft } from "lucide-react";
import Spinner from "@/components/ui/spinner";
import Link from "next/link";
import type { SubmitHandler, UseFormHandleSubmit } from "react-hook-form";
import type { monitorInfoProps } from "../../schemas/monitor-info";

type NewMonitorHeaderProps = {
  handleSubmit: UseFormHandleSubmit<monitorInfoProps>;
  onSubmit: SubmitHandler<monitorInfoProps>;
  isPending: boolean;
};

const NewMonitorHeader = ({
  handleSubmit,
  onSubmit,
  isPending,
}: NewMonitorHeaderProps) => {
  return (
    <header className="sf-page-header">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/monitors"
          className="flex size-9 cursor-pointer items-center justify-center rounded-[4px] border border-sf-border text-sf-text-muted transition-colors hover:bg-sf-bg hover:text-sf-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sf-blue/25"
        >
          <ArrowLeft className="size-4" />
          <span className="sr-only">Back to monitors</span>
        </Link>
        <div>
          <h1 className="text-xl font-semibold tracking-sf-tight text-sf-text">New monitor</h1>
          <p className="mt-1 text-xs text-sf-text-muted">Configure an endpoint health check</p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center gap-2"
      >
        <Link
          href="/dashboard/monitors"
          className="flex h-9 cursor-pointer items-center rounded-[4px] border border-sf-border px-4 font-sans text-xs font-semibold text-sf-text transition-colors hover:bg-sf-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sf-blue/25"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="flex h-9 cursor-pointer items-center gap-2 rounded-[4px] bg-sf-text px-4 font-sans text-xs font-semibold text-sf-btn-text shadow-sm transition-colors hover:bg-sf-blue hover:text-white active:bg-sf-btn-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sf-blue/30 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-sf-text disabled:hover:text-sf-btn-text"
        >
          {isPending ? (
            <>
              <Spinner label="Creating monitor" />
              <span>Creating monitor…</span>
            </>
          ) : (
            <>
              <span className="text-base leading-none">+</span>
              <span>Create monitor</span>
            </>
          )}
        </button>
      </form>
    </header>
  );
};

export default NewMonitorHeader;
