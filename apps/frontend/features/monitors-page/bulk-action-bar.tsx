"use client";

import { Pause, Play, Trash2, X } from "lucide-react";

interface Props {
  count: number;
  onClear: () => void;
}

const BulkActionBar = ({ count, onClear }: Props) => {
  return (
    <div className="mx-6 mb-3 flex items-center justify-between px-4 py-2.5 rounded-sf border border-sf-border bg-sf-surface shadow-sf-card">
      <div className="flex items-center gap-3">
        <span className="text-[13px] font-semibold text-sf-text">
          {count} selected
        </span>
        <span className="w-px h-4 bg-sf-border" />
        <div className="flex items-center gap-1.5">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-sf text-[12px] font-medium text-sf-text-sub border border-sf-border hover:border-sf-text-sub hover:text-sf-text transition-colors cursor-pointer">
            <Pause className="w-3.5 h-3.5" />
            Pause
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-sf text-[12px] font-medium text-sf-text-sub border border-sf-border hover:border-sf-green hover:text-sf-green transition-colors cursor-pointer">
            <Play className="w-3.5 h-3.5" />
            Resume
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-sf text-[12px] font-medium text-sf-text-sub border border-sf-border hover:border-sf-red hover:text-sf-red transition-colors cursor-pointer">
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </button>
        </div>
      </div>

      <button
        onClick={onClear}
        className="flex items-center gap-1 text-[12px] text-sf-text-muted hover:text-sf-text transition-colors cursor-pointer"
      >
        <X className="w-3.5 h-3.5" />
        Clear
      </button>
    </div>
  );
};

export default BulkActionBar;
