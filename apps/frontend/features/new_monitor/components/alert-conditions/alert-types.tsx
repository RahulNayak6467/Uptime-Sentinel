"use client";

import { Controller } from "react-hook-form";
import { alertCondition } from "../../types";
import ErrorMessage from "@/features/auth/error";

const AlertTypes = ({
  control,
  alertType,
  alertText,
  alertMessage,
  error,
}: alertCondition) => {
  const alertTypeThreshold = alertMessage === "success" ? "recoveryThreshold" : "failureThreshold"

  return (
    <div className="flex flex-col justify-between gap-3 border-b border-b-sf-border py-3 sm:flex-row sm:items-center">
      <div>
        <p className="text-sf-text font-semibold text-[14px] font-sans">
          {alertType}
        </p>
        <p className="text-[12px] text-sf-text-muted font-sans">{alertText}</p>
      </div>
      <div className="shrink-0">
        <div className="flex items-center gap-2">
        <Controller
          control={control}
          name={alertTypeThreshold}
          defaultValue={2}
          render={({ field }) => (
            <div className="flex items-center overflow-hidden rounded-sf-sm border border-sf-border">
          <button
            type="button"
            onClick={() => field.onChange(Math.max(1, field.value - 1))}
            className="px-3 py-1 text-sf-text-sub hover:bg-sf-bg transition-colors cursor-pointer text-[14px]"
          >
            −
          </button>
          <button
            type="button"
            className="min-w-[2.5rem] w-12 border-x border-sf-border bg-transparent px-1 py-1 text-center font-sans text-[14px] text-sf-text outline-none"
          >
            {field.value}
          </button>
          <button
            type="button"
            onClick={() => field.onChange(Math.min(10, field.value + 1))}
            className="px-3 py-1 text-sf-text-sub hover:bg-sf-bg transition-colors cursor-pointer text-[14px]"
          >
            +
          </button>
            </div>
          )}
        />
        <span className="text-[13px] text-sf-text-muted font-sans w-14">
          {alertMessage}
        </span>
        </div>
        <ErrorMessage error={error} />
      </div>
    </div>
  );
};

export default AlertTypes;
