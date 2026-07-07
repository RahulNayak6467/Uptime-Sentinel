import GoogleIcon from "@/components/ui/google-icon";
import GitHubIcon from "@/components/ui/github-icon";

type SocialAuthButtonsProps = {
  /** Divider label, e.g. "or continue with email". */
  dividerLabel: string;
};

const socialButtonClass =
  "flex h-10 w-full cursor-pointer items-center justify-center gap-2.5 rounded-md border border-sf-border bg-sf-surface px-4 text-sm font-medium text-sf-text transition-[background-color,border-color] hover:border-sf-text-muted hover:bg-sf-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sf-blue/30";

/**
 * "Continue with Google" and "Continue with GitHub" buttons plus the "or …"
 * divider shown beneath them. Click handlers are intentionally left out until
 * OAuth is wired up.
 */
const SocialAuthButtons = ({ dividerLabel }: SocialAuthButtonsProps) => (
  <div className="mt-6">
    <div className="flex flex-col gap-3">
      <button type="button" className={socialButtonClass}>
        <GoogleIcon />
        Continue with Google
      </button>

      <button type="button" className={socialButtonClass}>
        <GitHubIcon />
        Continue with GitHub
      </button>
    </div>

    <div className="mt-5 flex items-center gap-3">
      <span className="h-px flex-1 bg-sf-border" />
      <span className="text-xs text-sf-text-muted">{dividerLabel}</span>
      <span className="h-px flex-1 bg-sf-border" />
    </div>
  </div>
);

export default SocialAuthButtons;
