"use client";

import {
  Activity,
  ChartNoAxesCombined,
  CircleAlert,
  Gauge,
  ListChecks,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

type MonitorSection = {
  id: string;
  label: string;
  icon: LucideIcon;
};

const sections: MonitorSection[] = [
  { id: "overview", label: "Overview", icon: Gauge },
  {
    id: "response-time",
    label: "Response time",
    icon: ChartNoAxesCombined,
  },
  { id: "recent-checks", label: "Recent checks", icon: ListChecks },
  { id: "infrastructure", label: "Infrastructure", icon: Activity },
  { id: "incidents", label: "Incidents", icon: CircleAlert },
];

const MonitorSectionNav = () => {
  const [activeSection, setActiveSection] = useState(sections[0].id);

  useEffect(() => {
    const sectionElements = sections
      .map((section) => document.getElementById(section.id))
      .filter((element): element is HTMLElement => element !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find((entry) => entry.isIntersecting);

        if (visibleEntry) {
          setActiveSection(visibleEntry.target.id);
        }
      },
      {
        rootMargin: "-120px 0px -68% 0px",
        threshold: 0,
      },
    );

    sectionElements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="sticky top-3 z-20 mx-auto w-full max-w-full sm:w-fit">
      <nav
        aria-label="Monitor detail sections"
        className="overflow-x-auto rounded-md border border-sf-border/70 bg-sf-surface/60 p-1 shadow-[0_8px_28px_rgba(15,23,42,0.09)] ring-1 ring-sf-border/20 backdrop-blur-2xl supports-[backdrop-filter]:bg-sf-surface/55 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="flex min-w-max items-center gap-0.5">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;

            return (
              <a
                key={section.id}
                href={`#${section.id}`}
                aria-current={isActive ? "location" : undefined}
                onClick={() => setActiveSection(section.id)}
                className={`group relative flex h-9 shrink-0 items-center gap-1.5 rounded border px-2.5 text-xs font-semibold transition-[color,background-color,border-color,box-shadow,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sf-blue/30 focus-visible:ring-offset-1 focus-visible:ring-offset-sf-surface active:scale-[0.98] ${
                  isActive
                    ? "border-sf-blue/20 bg-sf-blue-bg text-sf-blue shadow-[0_1px_2px_rgba(15,23,42,0.05)]"
                    : "border-transparent text-sf-text-muted hover:border-sf-border/80 hover:bg-sf-bg/80 hover:text-sf-text"
                }`}
              >
                <span
                  className={`flex size-5 items-center justify-center rounded-sm transition-colors duration-200 ${
                    isActive
                      ? "bg-sf-blue text-white shadow-sm"
                      : "bg-sf-bg text-sf-text-muted group-hover:bg-sf-surface group-hover:text-sf-text"
                  }`}
                >
                  <Icon className="size-3" aria-hidden="true" />
                </span>
                {section.label}
              </a>
            );
          })}
        </div>
      </nav>

      <div
        className="pointer-events-none absolute inset-x-8 -bottom-3 h-3 rounded-full bg-sf-blue/5 blur-xl"
        aria-hidden="true"
      />
    </div>
  );
};

export default MonitorSectionNav;
