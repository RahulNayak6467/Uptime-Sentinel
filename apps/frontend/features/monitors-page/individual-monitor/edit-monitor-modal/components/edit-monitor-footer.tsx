import { Play, RotateCcw, Save } from "lucide-react";
import { secondaryButtonClass } from "../constants";

export const EditMonitorFooter = ({
  onCancel,
}: {
  onCancel: () => void;
}) => (
  <footer className="shrink-0 border-t border-sf-border bg-sf-surface px-4 py-3">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="hidden text-xs text-sf-text-muted sm:block">
        Changes are not saved until you confirm.
      </p>
      <div className="flex flex-col-reverse gap-2 sm:flex-row">
        <button
          type="button"
          onClick={onCancel}
          className={secondaryButtonClass}
        >
          Cancel
        </button>
        <button type="button" className={secondaryButtonClass}>
          <RotateCcw className="size-3.5" />
          Reset
        </button>
        <button
          type="button"
          className="flex h-9 cursor-pointer items-center justify-center gap-2 rounded-[4px] border border-sf-blue/30 bg-sf-blue-bg px-4 text-xs font-semibold text-sf-blue transition-colors hover:border-sf-blue"
        >
          <Play className="size-3.5" />
          Save & run check
        </button>
        <button
          type="button"
          className="flex h-9 cursor-pointer items-center justify-center gap-2 rounded-[4px] bg-sf-text px-4 text-xs font-semibold text-sf-btn-text shadow-sm transition-colors hover:bg-sf-blue hover:text-white"
        >
          <Save className="size-3.5" />
          Save changes
        </button>
      </div>
    </div>
  </footer>
);
