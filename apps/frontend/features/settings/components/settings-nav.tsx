"use client";

import { settingsNav } from "../data";
import type { SettingsSectionId } from "../types";

type SettingsNavProps = {
  active: SettingsSectionId;
  onSelect: (id: SettingsSectionId) => void;
};

const SettingsNav = ({ active, onSelect }: SettingsNavProps) => (
  <nav
    aria-label="Settings sections"
    className="w-full shrink-0 overflow-x-auto border-b border-sf-border pb-2 lg:sticky lg:top-6 lg:w-60 lg:self-start lg:overflow-visible lg:border-b-0 lg:pb-0"
  >
    <div className="flex min-w-max items-center gap-1 lg:block lg:min-w-0 lg:space-y-6">
      {settingsNav.map((group) => (
        <div key={group.heading} className="flex items-center gap-1 lg:block">
          <p className="sr-only mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-sf-text-muted lg:not-sr-only">
            {group.heading}
          </p>
          <ul className="flex items-center gap-1 lg:block lg:space-y-0.5">
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = item.id === active;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(item.id)}
                    aria-current={isActive ? "page" : undefined}
                    className={`relative flex min-h-8 min-w-max items-center gap-2.5 rounded-[3px] px-3.5 text-[12px] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-sf-blue/25 lg:w-full lg:min-w-0 ${
                      isActive
                        ? "bg-sf-bg font-semibold text-sf-text"
                        : "text-sf-text-muted hover:text-sf-text"
                    }`}
                  >
                    <Icon className="size-[15px] shrink-0" strokeWidth={1.8} aria-hidden="true" />
                    <span className="truncate">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  </nav>
);

export default SettingsNav;
