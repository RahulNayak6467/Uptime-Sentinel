import ErrorMessage from "@/features/auth/error";
import { newMonitorProps } from "../../types";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

const MonitorInfo = ({
  register,
  errors,
}: {
  register: newMonitorProps;
  errors: {
    errorsMonitorName: string | undefined;
    errorsMonitorUrl: string | undefined;
  };
}) => {
  return (
    <div className="mt-4 w-full bg-sf-surface">
      <div className="h-full w-full rounded-lg border border-sf-border">
        <div className="w-full rounded-t-lg border-b border-sf-border px-4 py-2">
          <h1 className="text-[14px] font-sans font-semibold tracking-normal text-sf-text">
            Basic Info
          </h1>
          <p className="text-[12px] font-sans text-sf-text-sub">
            Name your monitor and point it to a URL
          </p>
        </div>
        <div className="flex flex-col gap-3 px-4 py-3">
          <div className="flex flex-col gap-1">
            <label
              className="text-sf-text font-sans text-sf-label font-semibold"
              htmlFor="monitor-name"
            >
              Monitor name
            </label>
            <input
              {...register("monitorName")}
              id="monitor-name"
              className="rounded-sf-sm border border-sf-border px-4 py-2 font-sans text-[14px] text-sf-text outline-none transition-colors duration-150 placeholder:text-sf-text-muted focus:border-sf-text focus:shadow-sf-focus"
              type="text"
              required
              autoComplete="off"
              placeholder="e.g. API Gateway, Checkout, Redis"
            />
            {errors && <ErrorMessage error={errors.errorsMonitorName} />}
          </div>
          <div className="flex flex-col gap-1">
            <label
              className="text-sf-text font-sans text-sf-label font-semibold"
              htmlFor="monitor-url"
            >
              URL
            </label>
            <input
              {...register("url")}
              id="monitor-url"
              className="rounded-sf-sm border border-sf-border px-4 py-2 font-mono text-[14px] text-sf-text outline-none transition-colors duration-150 placeholder:text-sf-text-muted focus:border-sf-text focus:shadow-sf-focus"
              type="url"
              required
              autoComplete="off"
              placeholder="https://example.com/health"
            />
            {errors && <ErrorMessage error={errors.errorsMonitorUrl} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonitorInfo;
