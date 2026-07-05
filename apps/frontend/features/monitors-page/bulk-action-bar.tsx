"use client";

import { Pause, Play, Trash2, X } from "lucide-react";

interface Props {
  count: number;
  onClear: () => void;
}

const BulkActionBar = ({ count, onClear }: Props) => {
  return (
    <div className="mb-1 flex items-center justify-between gap-4 rounded-lg border border-sf-border bg-sf-surface px-4 py-2.5 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="rounded-full bg-sf-text px-2.5 py-1 text-[11px] font-semibold text-sf-btn-text">
          {count} selected
        </span>
        <span className="h-4 w-px bg-sf-border" />
        <div className="flex items-center gap-1.5">
          <button className="flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11px] font-medium text-sf-text-sub transition-colors hover:bg-sf-bg hover:text-sf-text">
            <Pause className="size-3.5" />
            Pause
          </button>
          <button className="flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11px] font-medium text-sf-text-sub transition-colors hover:bg-sf-green-bg hover:text-sf-green">
            <Play className="size-3.5" />
            Resume
          </button>
          <button className="flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11px] font-medium text-sf-text-sub transition-colors hover:bg-sf-red-bg hover:text-sf-red">
            <Trash2 className="size-3.5" />
            Delete
          </button>
        </div>
      </div>

      <button
        onClick={onClear}
        className="flex cursor-pointer items-center gap-1 rounded-md px-2 py-1.5 text-[11px] text-sf-text-muted transition-colors hover:bg-sf-bg hover:text-sf-text"
      >
        <X className="size-3.5" />
        Clear
      </button>
    </div>
  );
};

export default BulkActionBar;
