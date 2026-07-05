import { ArrowLeft } from "lucide-react";
import Spinner from "@/components/ui/spinner";
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
        <button className="flex cursor-pointer items-center gap-1.5 rounded-sf-sm px-2 py-1 text-sf-text-muted transition-colors hover:bg-sf-blue-bg hover:text-sf-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sf-blue/25">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sf-label font-sans">Monitors</span>
        </button>
        <div>
          <h1 className="sf-page-title">New monitor</h1>
          <p className="sf-page-subtitle">Configure an endpoint health check</p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center gap-2"
      >
        <button className="cursor-pointer rounded-sf-sm border border-sf-border px-4 py-1.5 font-sans text-sf-label font-semibold text-sf-text transition-colors hover:border-sf-blue hover:bg-sf-blue-bg hover:text-sf-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sf-blue/25">
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="flex cursor-pointer items-center gap-1.5 rounded-sf-sm bg-sf-text px-4 py-1.5 font-sans text-sf-label font-semibold text-sf-btn-text transition-colors hover:bg-sf-blue hover:text-white active:bg-sf-btn-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sf-blue/30 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-sf-text disabled:hover:text-sf-btn-text"
        >
          {isPending ? (
            <>
              <Spinner label="Creating monitor" />
              <span>Creating monitor…</span>
            </>
          ) : (
            <>
              <span>+</span>
              <span>Create monitor</span>
            </>
          )}
        </button>
      </form>
    </header>
  );
};

export default NewMonitorHeader;
