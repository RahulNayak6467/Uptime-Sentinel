import { CheckCircle2, Circle } from "lucide-react";

const SetupChecklist = ({ hasName, hasUrl }: { hasName: boolean; hasUrl: boolean }) => {
  const items = [
    { label: "Monitor type selected", complete: true },
    { label: "Monitor name provided", complete: hasName },
    { label: "Endpoint URL provided", complete: hasUrl },
  ];

  return (
    <div className="mt-3 rounded-lg border border-sf-border bg-sf-surface p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-sf-text">Required fields</h3>
        <span className="font-mono text-xs text-sf-text-muted">
          {items.filter((item) => item.complete).length}/{items.length}
        </span>
      </div>
      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-2.5 text-xs">
            {item.complete ? (
              <CheckCircle2 className="size-3.5 text-sf-green" />
            ) : (
              <Circle className="size-3.5 text-sf-text-muted" />
            )}
            <span className={item.complete ? "text-sf-text-sub" : "text-sf-text-muted"}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SetupChecklist;
