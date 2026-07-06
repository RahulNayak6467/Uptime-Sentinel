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
      className={`relative rounded-md border transition-[border-color,background-color,box-shadow] duration-150 ease-in-out ${
        comingSoon
          ? "border-[1.5px] border-sf-border opacity-50 cursor-not-allowed"
          : isActive
            ? "cursor-pointer border-[1.5px] border-sf-blue bg-sf-blue-bg shadow-[inset_0_0_0_1px_var(--color-sf-blue)]"
            : "cursor-pointer border-[1.5px] border-sf-border hover:border-sf-text-muted hover:bg-sf-bg"
      }`}
    >
      {comingSoon && (
        <span className="absolute right-2.5 top-2.5 rounded-sf bg-sf-bg px-1.5 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-wide text-sf-text-muted">
          Soon
        </span>
      )}
      <div className="flex flex-col p-3">
        <div
          className={`w-fit rounded-sf-sm p-1.5 transition-colors duration-150 ease-in-out ${
            isActive && !comingSoon ? "bg-sf-blue" : "bg-sf-bg"
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
