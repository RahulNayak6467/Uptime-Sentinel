"use client";

import { useState } from "react";
import { alertConditionsData } from "../../data";
import AlertTypes from "./alert-types";
import { newMonitorProps } from "../../types";
import ErrorMessage from "@/features/auth/error";

const AlertConditions = ({
  register,
  errors,
}: {
  register: newMonitorProps;
  errors: string | undefined;
}) => {
  return (
    <div className="mt-4 w-full bg-sf-surface">
      <div className="h-full w-full rounded-lg border border-sf-border">
        <div className="w-full rounded-t-lg border-b border-sf-border px-4 py-2">
          <h1 className="text-[14px] font-sans font-semibold tracking-normal text-sf-text">
            Alert conditions
          </h1>
          <p className="text-[12px] font-sans text-sf-text-sub">
            Define when this monitor should trigger an incident
          </p>
        </div>
        <div className="px-4 pb-4">
          {alertConditionsData.map((data) => (
            <AlertTypes
              key={data.id}
              alertType={data.alertType}
              alertMessage={data.alertMessage}
              alertText={data.alertText}
            />
          ))}

          <div className="flex justify-between items-start pt-4">
            <div>
              <p className="text-sf-text text-[14px] font-semibold font-sans">
                Response time alert
              </p>
              <p className="text-[12px] text-sf-text-sub font-sans">
                Alert when response exceeds this threshold
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <input
                {...register("responseTimeAlert", { valueAsNumber: true })}
                type="number"
                defaultValue={5000}
                min={0}
                className="w-28 rounded-sf-sm border border-sf-border px-3 py-1 text-center font-sans text-[14px] text-sf-text outline-none transition-colors duration-150 focus:border-sf-text focus:shadow-sf-focus"
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
