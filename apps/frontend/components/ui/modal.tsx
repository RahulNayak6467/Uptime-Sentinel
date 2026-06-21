"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  width?: string;
};

const Modal = ({
  open,
  onClose,
  title,
  description,
  children,
  width = "max-w-md",
}: ModalProps) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        className={`relative z-10 w-full ${width} mx-4 bg-sf-surface border border-sf-border rounded-sf-card shadow-sf-card`}
      >
        <div className="flex items-start justify-between px-5 pt-5 pb-4 border-b border-sf-border">
          <div>
            <h2 className="text-[15px] font-bold font-sans text-sf-text leading-snug">
              {title}
            </h2>
            {description && (
              <p className="text-[12px] font-sans text-sf-text-muted mt-0.5">
                {description}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-sf-text-muted hover:text-sf-text transition-colors cursor-pointer -mt-0.5 ml-4 shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
