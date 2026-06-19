"use client";

import { useState } from "react";
import { checkIntervals } from "../../data";

const CheckInterval = () => {
  const [selected, setSelected] = useState("5m");

  return (
    <div className="w-full bg-white mt-6">
      <div className="w-full h-full border border-sf-border rounded-lg">
        <div className="w-full border-b border-sf-border py-2 px-4 rounded-t-lg">
          <h1 className="text-[14px] font-sans font-semibold tracking-normal text-sf-text">
            Check interval
          </h1>
          <p className="text-[12px] font-sans text-sf-text-sub">
            How often to run this check from each selected region
          </p>
        </div>
        <div className="px-4 py-3 flex gap-2 flex-wrap">
          {checkIntervals.map((label) => (
            <button
              key={label}
              type="button"
              onClick={() => setSelected(label)}
              className={`px-3 py-1 rounded-lg border font-sans text-[12px] font-medium transition-colors duration-150 cursor-pointer ${
                selected === label
                  ? "bg-sf-text text-white border-sf-text"
                  : "bg-white text-sf-text border-sf-border hover:border-gray-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CheckInterval;
