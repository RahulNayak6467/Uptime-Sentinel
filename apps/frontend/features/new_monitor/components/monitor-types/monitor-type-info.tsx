"use client";

import { monitorTypesData } from "../../data";
import MonitorType from "./monitor-type";
import SectionHeader from "../section-header";
import ErrorMessage from "@/features/auth/error";

const MonitorTypeInfo = ({
  selected,
  onSelect,
  error,
}: {
  selected: string;
  onSelect: (type: string) => void;
  error: string | undefined;
}) => {
  return (
    <div className="w-full">
      <div className="h-full w-full overflow-hidden rounded-lg border border-sf-border bg-sf-surface shadow-sm">
        <SectionHeader step="01" title="Monitor type" description="Choose the kind of health check to run" />
        <div className="grid w-full grid-cols-1 gap-2.5 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-3">
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
        <div className="px-5 pb-5">
          <ErrorMessage error={error} />
        </div>
      </div>
    </div>
  );
};

export default MonitorTypeInfo;
