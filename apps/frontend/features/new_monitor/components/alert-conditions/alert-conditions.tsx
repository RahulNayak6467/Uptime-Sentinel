"use client";

import { alertConditionsData } from "../../data";
import AlertTypes from "./alert-types";
import { controlProps } from "../../types";
import SectionHeader from "../section-header";
import { Controller } from "react-hook-form";
import ErrorMessage from "@/features/auth/error";

const AlertConditions = ({
  control,
  errors,
  isTls = false,
}: {
  control: controlProps;
  errors: {
    failureThreshold: string | undefined;
    recoveryThreshold: string | undefined;
    responseTimeThresholdMS: string | undefined;
  };
  isTls?: boolean;
}) => {
  return (
    <div className="mt-4 w-full">
      <div className="h-full w-full overflow-hidden rounded-lg border border-sf-border bg-sf-surface shadow-sm">
        <SectionHeader step="05" title="Alert conditions" description="Define when this monitor should trigger an incident" />
        <div className="px-5 pb-5">
          {!isTls &&
            alertConditionsData.map((data) => (
              <AlertTypes
                control={control}
                key={data.id}
                alertType={data.alertType}
                alertMessage={data.alertMessage}
                alertText={data.alertText}
                error={
                  data.alertMessage === "success"
                    ? errors.recoveryThreshold
                    : errors.failureThreshold
                }
              />
            ))}

          <div className="flex flex-col justify-between gap-3 py-3 sm:flex-row sm:items-center">
            <div>
              <p className="font-sans text-[14px] font-semibold text-sf-text">
                Slow-response threshold
              </p>
              <p className="font-sans text-[12px] text-sf-text-muted">
                Response time that moves the latency chart into the red zone
              </p>
            </div>
            <div className="shrink-0">
              <Controller
                name="responseTimeThresholdMS"
                control={control}
                defaultValue={1000}
                render={({ field }) => (
                  <div className="relative w-36">
                    <input
                      type="number"
                      min={1}
                      max={60000}
                      value={field.value}
                      onChange={(event) => field.onChange(Number(event.target.value))}
                      className="h-9 w-full rounded-md border border-sf-border bg-sf-surface px-3 pr-10 text-[13px] text-sf-text outline-none transition-colors focus:border-sf-text-sub focus:shadow-sf-focus"
                    />
                    <span className="pointer-events-none absolute right-3 top-2.5 text-xs text-sf-text-muted">
                      ms
                    </span>
                  </div>
                )}
              />
              <ErrorMessage error={errors.responseTimeThresholdMS} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AlertConditions;
