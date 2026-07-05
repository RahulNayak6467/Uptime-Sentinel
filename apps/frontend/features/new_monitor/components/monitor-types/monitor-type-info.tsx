"use client";

import { monitorTypesData } from "../../data";
import MonitorType from "./monitor-type";
import SectionHeader from "../section-header";

const MonitorTypeInfo = ({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (type: string) => void;
}) => {
  return (
    <div className="w-full">
      <div className="h-full w-full overflow-hidden rounded-lg border border-sf-border bg-sf-surface shadow-sm">
        <SectionHeader step="01" title="Monitor type" description="Choose the kind of health check to run" />
        <div className="grid w-full grid-cols-1 gap-2.5 p-5 sm:grid-cols-2 xl:grid-cols-3">
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
