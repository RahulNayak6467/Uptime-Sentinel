"use client";

import {
  Activity,
  ChartNoAxesCombined,
  CircleAlert,
  Gauge,
  ListChecks,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type MonitorSection = {
  id: string;
  label: string;
  icon: LucideIcon;
};

const baseSections: MonitorSection[] = [
  { id: "overview", label: "Overview", icon: Gauge },
  {
    id: "response-time",
    label: "Response time",
    icon: ChartNoAxesCombined,
  },
  { id: "recent-checks", label: "Recent checks", icon: ListChecks },
  { id: "incidents", label: "Incidents", icon: CircleAlert },
];

const diagnosticsSection: MonitorSection = {
  id: "infrastructure",
  label: "Certificate",
  icon: Activity,
};

const MonitorSectionNav = ({ showTls = false }: { showTls?: boolean }) => {
  const sections = useMemo(
    () => (showTls ? [...baseSections, diagnosticsSection] : baseSections),
    [showTls],
  );
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
  }, [sections]);

  return (
    <div className="sticky top-0 z-20 w-full border-b border-sf-border bg-sf-bg">
      <nav
        aria-label="Monitor detail sections"
        className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="flex min-w-max items-center gap-1">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;

            return (
              <a
                key={section.id}
                href={`#${section.id}`}
                aria-current={isActive ? "location" : undefined}
                onClick={() => setActiveSection(section.id)}
                className={`group relative flex h-10 shrink-0 items-center gap-1.5 border-b-2 px-3 text-[13px] transition-colors focus-visible:outline-none focus-visible:border-sf-purple ${
                  isActive
                    ? "border-sf-text font-semibold text-sf-text"
                    : "border-transparent font-medium text-sf-text-muted hover:text-sf-text"
                }`}
              >
                <Icon
                  className={`size-3.5 ${isActive ? "text-sf-text" : "text-sf-text-muted group-hover:text-sf-text"}`}
                  aria-hidden="true"
                />
                {section.label}
              </a>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default MonitorSectionNav;
