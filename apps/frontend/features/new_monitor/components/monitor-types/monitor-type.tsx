import { monitorTypeProps } from "../../types";

const MonitorType = ({
  icon,
  checkType,
  featuresOffered,
  isActive,
  onClick,
  comingSoon,
}: monitorTypeProps) => {
  const Icon = icon;
  return (
    <div
      onClick={comingSoon ? undefined : onClick}
      className={`relative border rounded-lg transition-[border-color,background-color] duration-150 ease-in-out ${
        comingSoon
          ? "border-[1.5px] border-sf-border opacity-50 cursor-not-allowed"
          : isActive
            ? "border-[1.5px] border-sf-text bg-sf-blue-bg cursor-pointer"
            : "border-[1.5px] border-sf-border hover:border-sf-text-sub hover:bg-sf-bg cursor-pointer"
      }`}
    >
      {comingSoon && (
        <span className="absolute top-2.5 right-2.5 text-[10px] font-semibold font-sans px-1.5 py-0.5 rounded-full bg-sf-bg text-sf-text-muted tracking-wide">
          Soon
        </span>
      )}
      <div className="flex flex-col p-4">
        <div
          className={`w-fit p-1.5 rounded-[6px] transition-colors duration-150 ease-in-out ${
            isActive && !comingSoon ? "bg-sf-text" : "bg-sf-bg"
          }`}
        >
          <Icon
            className={`w-4 h-4 transition-colors ${
              isActive && !comingSoon ? "text-white" : "text-sf-text-muted"
            }`}
          />
        </div>
        <h3 className="font-sans font-bold text-sf-label text-sf-text mt-1.5">
          {checkType}
        </h3>
        <p className="font-sans font-medium text-[12px] text-sf-text-muted mt-0.5">
          {featuresOffered}
        </p>
      </div>
    </div>
  );
};

export default MonitorType;
