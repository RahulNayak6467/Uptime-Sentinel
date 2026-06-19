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
    <div className="flex flex-col gap-4 p-4 rounded-lg bg-sf-bg border border-sf-border">
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
              className={`px-3 py-1 text-[12px] font-sans font-medium rounded-lg border cursor-pointer transition-colors duration-150 ${
                selectedBodyType === type.id
                  ? "bg-sf-text text-white border-sf-text"
                  : "bg-white text-sf-text-sub border-sf-border hover:border-gray-300 hover:text-sf-text"
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
              className="w-full px-3 py-2 border border-sf-border rounded-lg font-mono text-[13px] text-sf-text bg-white outline-none focus:border-sf-text focus:shadow-sf-focus transition-colors duration-150"
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
              className="w-full px-3 py-2.5 border border-sf-border rounded-lg font-mono text-[13px] text-sf-text bg-white placeholder:text-sf-text-muted outline-none focus:border-sf-text focus:shadow-sf-focus transition-colors duration-150 resize-y"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default RequestBody;
