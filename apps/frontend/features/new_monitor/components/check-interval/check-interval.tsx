"use client";

import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { checkIntervals } from "../../data";
import SectionHeader from "../section-header";
import ErrorMessage from "@/features/auth/error";

const CheckInterval = <T extends FieldValues & { intervalSeconds: string }>({
  control,
  error,
  intervals = checkIntervals,
}: {
  control: Control<T>;
  error: string | undefined;
  intervals?: string[];
}) => {
  return (
    <Controller
      name={"intervalSeconds" as Path<T>}
      control={control}
      render={({ field }) => (
        <div className="mt-4 w-full">
          <div className="h-full w-full overflow-hidden rounded-lg border border-sf-border bg-sf-surface shadow-sm">
            <SectionHeader
              step="04"
              title="Check interval"
              description="Choose how frequently the endpoint is checked"
            />

            <div className="flex flex-wrap gap-2 p-5">
              {intervals.map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => field.onChange(label)}
                  className={`cursor-pointer rounded-sf-sm border px-3 py-1 font-sans text-[12px] font-medium transition-colors duration-150 ${
                    field.value === label
                      ? "border-sf-blue bg-sf-blue text-white"
                      : "bg-sf-surface text-sf-text border-sf-border hover:border-sf-text-sub"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="px-5 pb-5">
              <ErrorMessage error={error} />
            </div>
          </div>
        </div>
      )}
    />
  );
};

export default CheckInterval;
