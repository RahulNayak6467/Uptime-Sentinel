"use client";

import { useState } from "react";
import { httpMethods } from "../../data";
import RequestBody from "./request-body";

const BODY_METHODS = ["post", "put", "patch", "delete"];

const RequestType = () => {
  const [followRedirects, setFollowRedirects] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState("get");

  return (
    <div className="w-full bg-white mt-6">
      <div className="w-full h-full border border-sf-border rounded-lg">
        <div className="w-full border-b border-sf-border py-3 px-4 rounded-t-lg">
          <h1 className="text-[14px] font-sans font-semibold tracking-normal text-sf-text">
            Request Settings
          </h1>
          <p className="text-[12px] font-sans text-sf-text-sub">
            Configure how the request is sent to your endpoint
          </p>
        </div>
        <div className="px-4 py-4 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h3 className="text-sf-label font-semibold font-sans text-sf-text">
              HTTP method
            </h3>
            <div className="flex gap-2">
              {httpMethods.map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setSelectedMethod(method)}
                  className={`uppercase px-2 py-1 font-sans font-medium text-[12px] rounded-lg border cursor-pointer transition-colors duration-150 ${
                    selectedMethod === method
                      ? "bg-sf-text text-white border-sf-text"
                      : "bg-white text-sf-text-sub border-sf-border hover:border-gray-300 hover:text-sf-text"
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

          <div className="flex gap-4">
            <div className="flex flex-col gap-1 w-40">
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
                id="timeout"
                name="timeout"
                type="number"
                min={1}
                max={60}
                defaultValue={30}
                className="px-3 py-2 border border-sf-border rounded-lg font-sans text-[14px] text-sf-text outline-none focus:border-sf-text focus:shadow-sf-focus transition-colors duration-150"
              />
            </div>
            <div className="flex flex-col gap-1 w-40">
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
                id="expected-status"
                name="expectedStatus"
                type="number"
                min={100}
                max={599}
                defaultValue={200}
                className="px-3 py-2 border border-sf-border rounded-lg font-sans text-[14px] text-sf-text outline-none focus:border-sf-text focus:shadow-sf-focus transition-colors duration-150"
              />
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              role="switch"
              aria-checked={followRedirects}
              onClick={() => setFollowRedirects((prev) => !prev)}
              className={`relative w-8 h-4.5 rounded-full transition-colors duration-200 ease-in-out cursor-pointer shrink-0 ${
                followRedirects ? "bg-sf-text" : "bg-gray-200"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 bg-white rounded-full shadow-sm transition-transform duration-200 ease-in-out ${
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
