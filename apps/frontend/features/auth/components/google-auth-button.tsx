import GoogleIcon from "@/components/ui/google-icon";

type GoogleAuthButtonProps = {
  /** Divider label, e.g. "or continue with email". */
  dividerLabel: string;
};

/**
 * "Continue with Google" button plus the "or …" divider shown beneath it.
 * The click handler is intentionally left out until OAuth is wired up.
 */
const GoogleAuthButton = ({ dividerLabel }: GoogleAuthButtonProps) => (
  <div className="mt-6">
    <button
      type="button"
      className="flex h-10 w-full cursor-pointer items-center justify-center gap-2.5 rounded-md border border-sf-border bg-sf-surface px-4 text-sm font-medium text-sf-text transition-[background-color,border-color] hover:border-sf-text-muted hover:bg-sf-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sf-blue/30"
    >
      <GoogleIcon />
      Continue with Google
    </button>

    <div className="mt-5 flex items-center gap-3">
      <span className="h-px flex-1 bg-sf-border" />
      <span className="text-xs text-sf-text-muted">{dividerLabel}</span>
      <span className="h-px flex-1 bg-sf-border" />
    </div>
  </div>
);

export default GoogleAuthButton;
