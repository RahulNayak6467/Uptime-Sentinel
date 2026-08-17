import ErrorMessage from "@/features/auth/error";
import { FieldValues, Path, UseFormRegister } from "react-hook-form";
import SectionHeader from "../section-header";

type MonitorInfoProps<T extends FieldValues> = {
  register: UseFormRegister<T>;
  errors: {
    errorsMonitorName: string | undefined;
    errorsMonitorUrl: string | undefined;
  };
  urlLabel?: string;
  urlPlaceholder?: string;
  urlInputType?: "url" | "text";
};

const MonitorInfo = <T extends FieldValues & { monitorName: string; url: string }>({
  register,
  errors,
  urlLabel = "URL",
  urlPlaceholder = "https://example.com/health",
  urlInputType = "url",
}: MonitorInfoProps<T>) => {
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
              {...register("monitorName" as Path<T>)}
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
              {urlLabel}
            </label>
            <input
              {...register("url" as Path<T>)}
              id="monitor-url"
              className="rounded-md border border-sf-border bg-sf-bg/35 px-3 py-2.5 font-mono text-[13px] text-sf-text outline-none transition-colors placeholder:text-sf-text-muted focus:border-sf-text-sub focus:bg-sf-surface focus:shadow-sf-focus"
              type={urlInputType}
              required
              autoComplete="off"
              placeholder={urlPlaceholder}
            />
            {errors && <ErrorMessage error={errors.errorsMonitorUrl} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonitorInfo;
