"use client";

import { alertConditionsData } from "../../data";
import AlertTypes from "./alert-types";
import { newMonitorProps } from "../../types";
import ErrorMessage from "@/features/auth/error";
import SectionHeader from "../section-header";

const AlertConditions = ({
  register,
  errors,
}: {
  register: newMonitorProps;
  errors: string | undefined;
}) => {
  return (
    <div className="mt-4 w-full">
      <div className="h-full w-full overflow-hidden rounded-lg border border-sf-border bg-sf-surface shadow-sm">
        <SectionHeader step="05" title="Alert conditions" description="Define when this monitor should trigger an incident" />
        <div className="px-5 pb-5">
          {alertConditionsData.map((data) => (
            <AlertTypes
              key={data.id}
              alertType={data.alertType}
              alertMessage={data.alertMessage}
              alertText={data.alertText}
            />
          ))}

          <div className="flex flex-col justify-between gap-3 pt-4 sm:flex-row sm:items-start">
            <div>
              <p className="text-sf-text text-[14px] font-semibold font-sans">
                Response time alert
              </p>
              <p className="text-[12px] text-sf-text-sub font-sans">
                Alert when response exceeds this threshold
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <input
                {...register("responseTimeAlert", { valueAsNumber: true })}
                type="number"
                defaultValue={5000}
                min={0}
                className="w-28 rounded-sf-sm border border-sf-border px-3 py-1 text-center font-sans text-[14px] text-sf-text outline-none transition-colors duration-150 focus:border-sf-blue focus:shadow-sf-focus"
              />
              <span className="text-[13px] text-sf-text-muted font-sans w-14">
                ms
              </span>
              {errors && <ErrorMessage error={errors} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertConditions;
