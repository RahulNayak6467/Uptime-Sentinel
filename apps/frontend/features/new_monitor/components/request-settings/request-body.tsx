"use client";

import { useState } from "react";
import { bodyTypes } from "../../data";

type RequestBodyProps = {
  method: string;
};

const RequestBody = ({ method }: RequestBodyProps) => {
  const [selectedBodyType, setSelectedBodyType] = useState("none");
  const [contentType, setContentType] = useState("");

  const handleBodyTypeSelect = (id: string, defaultContentType: string) => {
    setSelectedBodyType(id);
    setContentType(defaultContentType);
  };

  const displayMethod = method.toUpperCase();

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-sf-border bg-sf-bg p-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-baseline gap-2">
          <h3 className="text-sf-label font-semibold font-sans text-sf-text">
            Request body
          </h3>
          <span className="text-[12px] text-sf-text-muted font-sans">
            — sent with the {displayMethod} request
          </span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {bodyTypes.map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() => handleBodyTypeSelect(type.id, type.contentType)}
              className={`cursor-pointer rounded-sf-sm border px-3 py-1 font-sans text-[12px] font-medium transition-colors duration-150 ${
                selectedBodyType === type.id
                  ? "bg-sf-text text-sf-btn-text border-sf-text"
                  : "bg-sf-surface text-sf-text-sub border-sf-border hover:border-sf-text-sub hover:text-sf-text"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {selectedBodyType !== "none" && (
        <>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-baseline gap-2">
              <label
                htmlFor="content-type"
                className="text-sf-label font-semibold font-sans text-sf-text"
              >
                Content-Type header
              </label>
              <span className="text-[12px] text-sf-text-muted font-sans">
                — sent with the request
              </span>
            </div>
            <input
              id="content-type"
              name="contentType"
              type="text"
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              className="w-full rounded-sf-sm border border-sf-border bg-sf-surface px-3 py-2 font-mono text-[13px] text-sf-text outline-none transition-colors duration-150 focus:border-sf-text focus:shadow-sf-focus"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <h3 className="text-sf-label font-semibold font-sans text-sf-text">
              Body content
            </h3>
            <textarea
              name="requestBody"
              placeholder="Raw request body…"
              rows={7}
              className="w-full resize-y rounded-sf-sm border border-sf-border bg-sf-surface px-3 py-2.5 font-mono text-[13px] text-sf-text outline-none transition-colors duration-150 placeholder:text-sf-text-muted focus:border-sf-text focus:shadow-sf-focus"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default RequestBody;
