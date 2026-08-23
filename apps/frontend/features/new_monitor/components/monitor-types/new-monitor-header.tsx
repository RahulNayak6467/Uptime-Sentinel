import { ArrowLeft } from "lucide-react";
import Spinner from "@/components/ui/spinner";
import Link from "next/link";
import type { FieldValues, SubmitHandler, UseFormHandleSubmit } from "react-hook-form";

type NewMonitorHeaderProps<T extends FieldValues> = {
  handleSubmit: UseFormHandleSubmit<T>;
  onSubmit: SubmitHandler<T>;
  isPending: boolean;
};

const NewMonitorHeader = <T extends FieldValues>({
  handleSubmit,
  onSubmit,
  isPending,
}: NewMonitorHeaderProps<T>) => {
  return (
    <header className="sf-page-header">
      <div className="flex min-w-0 items-center gap-3">
        <Link
          href="/dashboard/monitors"
          className="flex size-9 cursor-pointer items-center justify-center rounded-[4px] border border-sf-border text-sf-text-muted transition-colors hover:bg-sf-bg hover:text-sf-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sf-blue/25"
        >
          <ArrowLeft className="size-4" />
          <span className="sr-only">Back to monitors</span>
        </Link>
        <div className="min-w-0">
          <h1 className="text-xl font-semibold tracking-sf-tight text-sf-text">New monitor</h1>
          <p className="mt-1 text-xs text-sf-text-muted">Configure an endpoint health check</p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit, (errors) => console.log(errors))}
        className="flex w-full items-center gap-2 sm:w-auto"
      >
        <Link
          href="/dashboard/monitors"
          className="flex h-9 flex-1 cursor-pointer items-center justify-center rounded-[4px] border border-sf-border px-4 font-sans text-xs font-semibold text-sf-text transition-colors hover:bg-sf-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sf-blue/25 sm:flex-none"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="flex h-9 flex-1 cursor-pointer items-center justify-center gap-2 rounded-[4px] bg-sf-text px-4 font-sans text-xs font-semibold text-sf-btn-text shadow-sm transition-colors hover:bg-sf-blue hover:text-white active:bg-sf-btn-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sf-blue/30 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-sf-text disabled:hover:text-sf-btn-text sm:flex-none"
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
