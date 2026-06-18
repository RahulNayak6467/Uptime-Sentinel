import { monitorStatsProps } from "./types";

const Configure = ({ icon, label }: monitorStatsProps) => {
  const Icon = icon;
  return (
    <div className="flex items-center w-full  hover:bg-gray-100 rounded-sm cursor-pointer">
      <div className="flex gap-2 items-center px-2  py-1">
        <Icon className="h-4 w-4 text-gray-500" />
        <p className="text-sf-label font-medium text-sf-text-sub tracking-wide">
          {label}
        </p>
      </div>
    </div>
  );
};

export default Configure;
