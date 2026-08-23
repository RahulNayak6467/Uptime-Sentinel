import ErrorMessage from "@/features/auth/error";
import { newMonitorProps } from "../../types";

type RequestTimeoutProps = {
  register: newMonitorProps;
  error: string | undefined;
};

const RequestTimeout = ({ register, error }: RequestTimeoutProps) => {
  return (
    <div>
      <div className="flex flex-col gap-1">
        <label
          htmlFor="request-timeout"
          className="flex items-baseline gap-1.5 font-sans text-sf-label font-semibold text-sf-text"
        >
          Request timeout
          <span className="text-[12px] font-normal text-sf-text-muted">
            1,000–60,000 ms
          </span>
        </label>
        <div className="relative">
          <input
            {...register("requestTimeoutMS", { valueAsNumber: true })}
            id="request-timeout"
            type="number"
            min={1000}
            max={60000}
            step={1000}
            className="w-full rounded-md border border-sf-border bg-sf-bg/35 px-3 py-2.5 pr-12 font-mono text-[13px] text-sf-text outline-none transition-colors focus:border-sf-text-sub focus:bg-sf-surface focus:shadow-sf-focus"
          />
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center font-mono text-xs text-sf-text-muted">
            ms
          </span>
        </div>
        <p className="text-[12px] text-sf-text-muted">
          A request that runs longer than this is counted as a failed check.
        </p>
      </div>
      <ErrorMessage error={error} />
    </div>
  );
};

export default RequestTimeout;
