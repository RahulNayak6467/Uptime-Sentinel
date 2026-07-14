"use client";

import { httpMethods } from "../../data";
import RequestBody from "./request-body";
import { controlProps, newMonitorProps, setValueProps, watchProps } from "../../types";
import ErrorMessage from "@/features/auth/error";
import SectionHeader from "../section-header";
import { Controller } from "react-hook-form";
import RequestTimeout from "./request-timeout";
import ExpectedStatusCodes from "./expected-status-codes";

const BODY_METHODS = ["post", "put", "patch", "delete"];

const RequestType = ({
  watch,
  control,
  register,
  setValue,
  errors,
}: {
    watch: watchProps;
    control: controlProps;
    register: newMonitorProps;
    setValue: setValueProps;
  errors: {
    errorsStatusCodes: string | undefined;
    errorsHttpMethod: string | undefined;
    errorsRequestBodyType: string | undefined;
    errorsContentType: string | undefined;
    errorsRequestBody: string | undefined;
    errorsRequestTimeoutMS: string | undefined;
  };
}) => {
  const method = watch("httpMethod")
  return (
    <div className="mt-4 w-full">
      <div className="h-full w-full overflow-hidden rounded-lg border border-sf-border bg-sf-surface shadow-sm">
        <SectionHeader step="03" title="Request settings" description="Configure how the request is sent" />
        <div className="flex flex-col gap-5 p-4 sm:p-5">
          <div className="flex flex-col gap-1">
            <h3 className="text-sf-label font-semibold font-sans text-sf-text">
              HTTP method
            </h3>
          <Controller
              name="httpMethod"
              defaultValue="GET"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-3 gap-1.5 sm:flex sm:flex-wrap">
                  {httpMethods.map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => field.onChange(method.toUpperCase())}
                      className={`cursor-pointer rounded-sf-sm border px-2 py-1 font-sans text-[12px] font-medium uppercase transition-colors duration-150 ${
                        field.value.toLowerCase() === method
                          ? "border-sf-blue bg-sf-blue text-white"
                          : "bg-sf-surface text-sf-text-sub border-sf-border hover:border-sf-text-sub hover:text-sf-text"
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              )}
            />
            <ErrorMessage error={errors.errorsHttpMethod} />
          </div>

          {BODY_METHODS.includes(method.toLowerCase()) && (
            <RequestBody
              method={method.toLowerCase()}
              control={control}
              register={register}
              setValue={setValue}
              errors={{
                requestBodyType: errors.errorsRequestBodyType,
                contentType: errors.errorsContentType,
                requestBody: errors.errorsRequestBody,
              }}
            />
          )}

          <ExpectedStatusCodes
            control={control}
            error={errors.errorsStatusCodes}
          />

          <RequestTimeout
            register={register}
            error={errors.errorsRequestTimeoutMS}
          />

        </div>
      </div>
    </div>
  );
};

export default RequestType;
