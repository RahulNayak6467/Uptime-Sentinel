"use client";

import { useState } from "react";
import { httpMethods } from "../../data";
import RequestBody from "./request-body";
import { newMonitorProps } from "../../types";
import ErrorMessage from "@/features/auth/error";
import SectionHeader from "../section-header";

const BODY_METHODS = ["post", "put", "patch", "delete"];

const RequestType = ({
  register,
  errors,
  selectedMethod,
  onMethodChange,
}: {
  register: newMonitorProps;
  errors: {
    errorsTimeout: string | undefined;
    errorsStatusCode: string | undefined;
  };
  selectedMethod: string;
  onMethodChange: (method: string) => void;
}) => {
  const [followRedirects, setFollowRedirects] = useState(true);

  return (
    <div className="mt-4 w-full">
      <div className="h-full w-full overflow-hidden rounded-lg border border-sf-border bg-sf-surface shadow-sm">
        <SectionHeader step="03" title="Request settings" description="Configure how the request is sent" />
        <div className="flex flex-col gap-5 p-5">
          <div className="flex flex-col gap-1">
            <h3 className="text-sf-label font-semibold font-sans text-sf-text">
              HTTP method
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {httpMethods.map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => onMethodChange(method)}
                  className={`cursor-pointer rounded-sf-sm border px-2 py-1 font-sans text-[12px] font-medium uppercase transition-colors duration-150 ${
                    selectedMethod === method
                      ? "border-sf-text bg-sf-text text-sf-btn-text"
                      : "bg-sf-surface text-sf-text-sub border-sf-border hover:border-sf-text-sub hover:text-sf-text"
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          {BODY_METHODS.includes(selectedMethod) && (
            <RequestBody method={selectedMethod} />
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label
                htmlFor="timeout"
                className="flex items-baseline gap-1.5 font-sans text-sf-label font-semibold text-sf-text"
              >
                Timeout
                <span className="text-[12px] font-normal text-sf-text-muted">
                  seconds
                </span>
              </label>
              <input
                {...register("timeout", { valueAsNumber: true })}
                id="timeout"
                name="timeout"
                type="number"
                min={1}
                max={60}
                defaultValue={30}
                className="rounded-md border border-sf-border bg-sf-bg/35 px-3 py-2.5 font-sans text-[13px] text-sf-text outline-none transition-colors focus:border-sf-text-sub focus:bg-sf-surface focus:shadow-sf-focus"
              />
              {errors && <ErrorMessage error={errors.errorsTimeout} />}
            </div>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="expected-status"
                className="flex items-baseline gap-1.5 font-sans text-sf-label font-semibold text-sf-text"
              >
                Expected status
                <span className="text-[12px] font-normal text-sf-text-muted">
                  e.g. 200
                </span>
              </label>
              <input
                {...register("statusCode", { valueAsNumber: true })}
                id="expected-status"
                name="expectedStatus"
                type="number"
                min={100}
                max={599}
                defaultValue={200}
                className="rounded-md border border-sf-border bg-sf-bg/35 px-3 py-2.5 font-sans text-[13px] text-sf-text outline-none transition-colors focus:border-sf-text-sub focus:bg-sf-surface focus:shadow-sf-focus"
              />
            </div>
            {errors && <ErrorMessage error={errors.errorsStatusCode} />}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              role="switch"
              aria-checked={followRedirects}
              onClick={() => setFollowRedirects((prev) => !prev)}
              className={`relative w-8 h-4.5 rounded-full transition-colors duration-200 ease-in-out cursor-pointer shrink-0 ${
                followRedirects ? "bg-sf-toggle-on" : "bg-sf-toggle-off"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 bg-sf-bg rounded-full shadow-sm transition-transform duration-200 ease-in-out ${
                  followRedirects ? "translate-x-3.5" : "translate-x-0"
                }`}
              />
            </button>
            <div>
              <p className="text-sf-label font-semibold font-sans text-sf-text">
                Follow redirects
              </p>
              <p className="text-[12px] font-sans text-sf-text-muted">
                Automatically follow up to 5 redirects
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestType;
