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
    <header className="flex items-center justify-between px-6 py-3 border-b border-sf-border bg-sf-surface">
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-1.5 text-sf-text-muted hover:text-sf-text-sub transition-colors cursor-pointer">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sf-label font-sans">Monitors</span>
        </button>
        <h1 className="text-[16px] font-bold text-sf-text font-sans">
          New monitor
        </h1>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center gap-2"
      >
        <button className="px-4 py-1.5 text-sf-label font-semibold font-sans text-sf-text border border-sf-border rounded-sf hover:bg-sf-bg transition-colors cursor-pointer">
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-1.5 px-4 py-1.5 text-sf-label font-semibold font-sans text-sf-btn-text bg-sf-text rounded-sf hover:bg-sf-btn-hover active:bg-sf-btn-active transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
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
