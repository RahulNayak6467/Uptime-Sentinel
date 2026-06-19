"use client";

import { useState } from "react";
import { monitorTypesData } from "../../data";
import MonitorType from "./monitor-type";

const MonitorTypeInfo = () => {
  const [selected, setSelected] = useState<string>("HTTP/HTTPS");

  return (
    <div className="w-full bg-sf-surface">
      <div className="w-full h-full border border-sf-border rounded-lg">
        <div className="w-full border-b border-sf-border py-3 px-4 rounded-t-lg">
          <h1 className="text-[14px] font-sans font-semibold tracking-normal text-sf-text">
            Monitor Type
          </h1>
          <p className="text-[12px] font-sans text-sf-text-sub">
            What kind of check should we run?
          </p>
        </div>
        <div className="w-full grid grid-cols-3 gap-x-4 gap-y-4 px-4 py-6">
          {monitorTypesData.map((monitor) => (
            <MonitorType
              key={monitor.id}
              icon={monitor.icon}
              checkType={monitor.checkType}
              featuresOffered={monitor.featuresOffered}
              isActive={selected === monitor.checkType}
              onClick={() => setSelected(monitor.checkType)}
              comingSoon={monitor.comingSoon}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MonitorTypeInfo;
