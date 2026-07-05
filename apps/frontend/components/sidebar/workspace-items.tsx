import { monitorStatsProps } from "./types";

const WorkSpace = ({ icon, label }: monitorStatsProps) => {
  const Icon = icon;
  return (
    <div className="flex w-full cursor-pointer items-center rounded-sf-sm hover:bg-sf-bg">
      <div className="flex gap-2 items-center px-2 py-1">
        <Icon className="h-4 w-4 text-sf-text-muted" />
        <p className="text-sf-label font-medium text-sf-text-sub tracking-wide">
          {label}
        </p>
      </div>
    </div>
  );
};

export default WorkSpace;
