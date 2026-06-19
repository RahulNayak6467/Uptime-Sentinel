import ErrorMessage from "@/features/auth/error";
import { newMonitorProps } from "../../types";

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
    <div className="w-full bg-sf-surface mt-6">
      <div className="w-full h-full border border-sf-border rounded-lg">
        <div className="w-full border-b border-sf-border py-3 px-4 rounded-t-lg">
          <h1 className="text-[14px] font-sans font-semibold tracking-normal text-sf-text">
            Basic Info
          </h1>
          <p className="text-[12px] font-sans text-sf-text-sub">
            Name your monitor and point it to a URL
          </p>
        </div>
        <div className="flex flex-col gap-4 p-4">
          <div className="flex flex-col gap-1">
            <label
              className="text-sf-text font-sans text-sf-label font-semibold"
              htmlFor="monitor-name"
            >
              Monitor name
            </label>
            <input
              {...register("monitorName")}
              {...(errors && <ErrorMessage error={errors.errorsMonitorName} />)}
              id="monitor-name"
              name="monitorName"
              className="px-4 py-2 border border-sf-border text-sf-text rounded-lg font-sans text-[14px] outline-none placeholder:text-sf-text-muted focus:border-sf-text focus:shadow-sf-focus transition-colors duration-150"
              type="text"
              required
              autoComplete="off"
              placeholder="e.g. API Gateway, Checkout, Redis"
            />
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
              {...(errors && <ErrorMessage error={errors.errorsMonitorUrl} />)}
              id="monitor-url"
              name="monitorUrl"
              className="px-4 py-2 border border-sf-border text-sf-text rounded-lg font-mono text-[14px] outline-none placeholder:text-sf-text-muted focus:border-sf-text focus:shadow-sf-focus transition-colors duration-150"
              type="url"
              required
              autoComplete="off"
              placeholder="https://example.com/health"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonitorInfo;
