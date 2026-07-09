"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

const DarkModeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      className="flex min-h-9 w-full cursor-pointer items-center gap-3 rounded-sf-sm px-2.5 py-2 text-sf-text-sub transition-colors hover:bg-sf-bg hover:text-sf-text"
    >
      <span className="relative size-4 shrink-0" aria-hidden="true">
        <Sun
          className={`absolute inset-0 size-4 transition-opacity duration-150 ease-out motion-reduce:transition-none ${
            isDark ? "opacity-100" : "opacity-0"
          }`}
        />
        <Moon
          className={`absolute inset-0 size-4 transition-opacity duration-150 ease-out motion-reduce:transition-none ${
            isDark ? "opacity-0" : "opacity-100"
          }`}
        />
      </span>
      <span className="font-sans text-[13px]">
        {isDark ? "Light mode" : "Dark mode"}
      </span>
    </button>
  );
};

export default DarkModeToggle;
