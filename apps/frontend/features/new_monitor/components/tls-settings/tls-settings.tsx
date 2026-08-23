"use client";

import type { ReactNode } from "react";
import { UseFormRegister } from "react-hook-form";
import { tlsMonitorProps } from "../../schemas/monitor-info";
import SectionHeader from "../section-header";
import ErrorMessage from "@/features/auth/error";

const inputClass =
  "w-full rounded-md border border-sf-border bg-sf-bg/35 px-3 py-2.5 font-mono text-[13px] text-sf-text outline-none transition-colors focus:border-sf-text-sub focus:bg-sf-surface focus:shadow-sf-focus";

const tlsVersions = ["TLSv1.2", "TLSv1.3", "TLSv1.1", "TLSv1"];

const Field = ({
  label,
  hint,
  children,
  help,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  help?: string;
}) => (
  <div className="flex flex-col gap-1">
    <label className="flex items-baseline gap-1.5 font-sans text-sf-label font-semibold text-sf-text">
      {label}
      {hint ? <span className="text-[12px] font-normal text-sf-text-muted">{hint}</span> : null}
    </label>
    {children}
    {help ? <p className="text-[12px] text-sf-text-muted">{help}</p> : null}
  </div>
);

type TlsSettingsProps = {
  register: UseFormRegister<tlsMonitorProps>;
  errors: {
    port: string | undefined;
    minTlsVersion: string | undefined;
    requestTimeoutMS: string | undefined;
    warningThresholdDays: string | undefined;
    expiryAlertThresholds: string | undefined;
  };
};

const TlsSettings = ({ register, errors }: TlsSettingsProps) => {
  return (
    <div className="mt-4 w-full">
      <div className="h-full w-full overflow-hidden rounded-lg border border-sf-border bg-sf-surface shadow-sm">
        <SectionHeader
          step="03"
          title="TLS & certificate settings"
          description="Connection target and certificate expiry policy"
          badge="TLS"
        />

        <div className="grid gap-4 p-4 sm:p-5 md:grid-cols-2">
          <Field label="Port" hint="1–65535">
            <input
              {...register("port", { valueAsNumber: true })}
              type="number"
              min={1}
              max={65535}
              className={inputClass}
            />
            <ErrorMessage error={errors.port} />
          </Field>

          <Field label="Minimum TLS version" help="Reject handshakes below this version.">
            <select {...register("minTlsVersion")} className={inputClass}>
              {tlsVersions.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
            <ErrorMessage error={errors.minTlsVersion} />
          </Field>

          <Field label="Connection timeout" hint="1,000–60,000 ms" help="A handshake slower than this counts as a failed check.">
            <div className="relative">
              <input
                {...register("requestTimeoutMS", { valueAsNumber: true })}
                type="number"
                min={1000}
                max={60000}
                step={1000}
                className={`${inputClass} pr-12`}
              />
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center font-mono text-xs text-sf-text-muted">ms</span>
            </div>
            <ErrorMessage error={errors.requestTimeoutMS} />
          </Field>

          <Field label="Warning threshold" hint="days" help="Certificate is marked “Expiring” when fewer days remain.">
            <div className="relative">
              <input
                {...register("warningThresholdDays", { valueAsNumber: true })}
                type="number"
                min={1}
                max={365}
                className={`${inputClass} pr-14`}
              />
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center font-mono text-xs text-sf-text-muted">days</span>
            </div>
            <ErrorMessage error={errors.warningThresholdDays} />
          </Field>

          <Field label="Expiry alert thresholds" hint="days before expiry" help="Comma-separated days at which to fire expiry alerts.">
            <input
              {...register("expiryAlertThresholds")}
              type="text"
              placeholder="30, 14, 7, 1"
              className={inputClass}
            />
            <ErrorMessage error={errors.expiryAlertThresholds} />
          </Field>
        </div>
      </div>
    </div>
  );
};

export default TlsSettings;
