import { cn } from "@/lib/utils";

type SpinnerProps = {
  size?: number;

  strokeWidth?: number;
  className?: string;

  label?: string;
};

const Spinner = ({
  size = 16,
  strokeWidth = 2,
  className,
  label = "Loading",
}: SpinnerProps) => {
  return (
    <svg
      role="status"
      aria-label={label}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={cn("animate-spin motion-reduce:animate-none", className)}
    >
      {/* faint full track */}
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        opacity={0.2}
      />
      {/* bright moving arc */}
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
};

export default Spinner;
