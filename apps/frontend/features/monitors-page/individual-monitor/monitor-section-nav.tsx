const sections = [
  { href: "#overview", label: "Overview" },
  { href: "#response-time", label: "Response time" },
  { href: "#recent-checks", label: "Recent checks" },
  { href: "#infrastructure", label: "Infrastructure" },
  { href: "#incidents", label: "Incidents" },
];

const MonitorSectionNav = () => (
  <nav
    aria-label="Monitor detail sections"
    className="sticky top-0 z-20 flex items-center gap-1 overflow-x-auto rounded-lg border border-sf-border bg-sf-surface/95 p-1 shadow-sm backdrop-blur"
  >
    {sections.map((section) => (
      <a
        key={section.href}
        href={section.href}
        className="shrink-0 rounded-md px-3 py-1.5 text-[11px] font-medium text-sf-text-muted transition-colors hover:bg-sf-bg hover:text-sf-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sf-blue/25"
      >
        {section.label}
      </a>
    ))}
  </nav>
);

export default MonitorSectionNav;
