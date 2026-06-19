"use client";

import { useTheme } from "next-themes";
import { AnimatedThemeToggler } from "../ui/animated-theme-toggler";

const DarkModeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <div className="flex items-center gap-3 w-full px-2 py-1.5 rounded-sf hover:bg-sf-bg transition-colors">
      <AnimatedThemeToggler
        variant="circle"
        duration={400}
        fromCenter={true}
        theme={isDark ? "dark" : "light"}
        onThemeChange={setTheme}
        className="text-sf-text-sub hover:text-sf-text cursor-pointer shrink-0 [&>svg]:w-4 [&>svg]:h-4"
      />
      <span className="text-[13.5px] font-sans text-sf-text-sub pointer-events-none">
        {isDark ? "Light mode" : "Dark mode"}
      </span>
    </div>
  );
};

export default DarkModeToggle;
