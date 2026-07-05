"use client";

import { monitorTypesData } from "../../data";
import MonitorType from "./monitor-type";

const MonitorTypeInfo = ({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (type: string) => void;
}) => {
  return (
    <div className="w-full bg-sf-surface">
      <div className="h-full w-full rounded-lg border border-sf-border">
        <div className="w-full rounded-t-lg border-b border-sf-border px-4 py-2">
          <h1 className="text-[14px] font-sans font-semibold tracking-normal text-sf-text">
            Monitor Type
          </h1>
          <p className="text-[12px] font-sans text-sf-text-sub">
            What kind of check should we run?
          </p>
        </div>
        <div className="grid w-full grid-cols-3 gap-3 p-4">
          {monitorTypesData.map((monitor) => (
            <MonitorType
              key={monitor.id}
              icon={monitor.icon}
              checkType={monitor.checkType}
              featuresOffered={monitor.featuresOffered}
              isActive={selected === monitor.checkType}
              onClick={() => onSelect(monitor.checkType)}
              comingSoon={monitor.comingSoon}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MonitorTypeInfo;
