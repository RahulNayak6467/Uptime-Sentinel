"use client";

import { useState } from "react";
import { Controller } from "react-hook-form";
import ErrorMessage from "@/features/auth/error";
import { controlProps } from "../../types";

type ExpectedStatusCodesProps = {
  control: controlProps;
  error: string | undefined;
};

const ExpectedStatusCodes = ({
  control,
  error,
}: ExpectedStatusCodesProps) => {
  const [statusCode, setStatusCode] = useState("");
  const [inputError, setInputError] = useState<string>();

  return (
    <Controller
      name="statusCodes"
      control={control}
      render={({ field }) => {
        const statusCodes = field.value ?? [];

        const addStatusCode = () => {
          const parsedStatusCode = Number(statusCode.trim());

          if (!Number.isInteger(parsedStatusCode)) {
            setInputError("Enter a whole-number status code");
            return;
          }

          if (parsedStatusCode < 100 || parsedStatusCode > 599) {
            setInputError("Status code must be between 100 and 599");
            return;
          }

          if (statusCodes.includes(parsedStatusCode)) {
            setInputError("This status code has already been added");
            return;
          }

          field.onChange([...statusCodes, parsedStatusCode]);
          setStatusCode("");
          setInputError(undefined);
        };

        return (
          <div>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="expected-status-code"
                className="flex items-baseline gap-1.5 font-sans text-sf-label font-semibold text-sf-text"
              >
                Expected status codes
                <span className="text-[12px] font-normal text-sf-text-muted">
                  e.g. 200, 201
                </span>
              </label>

              <div className="flex gap-2">
                <input
                  id="expected-status-code"
                  type="number"
                  min={100}
                  max={599}
                  value={statusCode}
                  onChange={(event) => {
                    setStatusCode(event.target.value);
                    setInputError(undefined);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      addStatusCode();
                    }
                  }}
                  placeholder="200"
                  className="min-w-0 flex-1 rounded-md border border-sf-border bg-sf-bg/35 px-3 py-2.5 font-mono text-[13px] text-sf-text outline-none transition-colors focus:border-sf-text-sub focus:bg-sf-surface focus:shadow-sf-focus"
                />
                <button
                  type="button"
                  onClick={addStatusCode}
                  className="cursor-pointer rounded-md border border-sf-border bg-sf-surface px-4 py-2.5 text-[13px] font-medium text-sf-text transition-colors hover:bg-sf-bg"
                >
                  Add
                </button>
              </div>

              <div className="mt-1 flex min-h-7 flex-wrap gap-2">
                {statusCodes.map((code) => (
                  <span
                    key={code}
                    className="inline-flex items-center gap-1.5 rounded-sf border border-sf-border bg-sf-bg px-2 py-1 font-mono text-xs text-sf-text"
                  >
                    {code}
                    <button
                      type="button"
                      aria-label={`Remove status code ${code}`}
                      onClick={() => {
                        field.onChange(
                          statusCodes.filter((status) => status !== code),
                        );
                      }}
                      className="cursor-pointer text-sf-text-muted transition-colors hover:text-sf-red"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
            <ErrorMessage error={inputError ?? error} />
          </div>
        );
      }}
    />
  );
};

export default ExpectedStatusCodes;
