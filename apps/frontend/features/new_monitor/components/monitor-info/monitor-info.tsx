import ErrorMessage from "@/features/auth/error";
import { newMonitorProps } from "../../types";
import SectionHeader from "../section-header";

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
    <div className="mt-4 w-full">
      <div className="h-full w-full overflow-hidden rounded-lg border border-sf-border bg-sf-surface shadow-sm">
        <SectionHeader step="02" title="Basic information" description="Name the monitor and provide its endpoint" />
        <div className="grid gap-4 p-4 sm:p-5 md:grid-cols-2">
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
              className="rounded-md border border-sf-border bg-sf-bg/35 px-3 py-2.5 font-sans text-[13px] text-sf-text outline-none transition-colors placeholder:text-sf-text-muted focus:border-sf-text-sub focus:bg-sf-surface focus:shadow-sf-focus"
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
              className="rounded-md border border-sf-border bg-sf-bg/35 px-3 py-2.5 font-mono text-[13px] text-sf-text outline-none transition-colors placeholder:text-sf-text-muted focus:border-sf-text-sub focus:bg-sf-surface focus:shadow-sf-focus"
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
