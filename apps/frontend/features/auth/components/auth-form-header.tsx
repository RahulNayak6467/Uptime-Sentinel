import Link from "next/link";
import UptimeSentinelImage from "@/components/ui/uptime-sentinel";

type AuthFormHeaderProps = {
  title: string;
  description: string;
};

const AuthFormHeader = ({ title, description }: AuthFormHeaderProps) => (
  <header>
    <Link
      href="/"
      className="inline-flex items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sf-blue/30"
    >
      <UptimeSentinelImage />
      <span className="text-sm font-semibold tracking-sf-tight text-sf-text">
        UptimeSentinel
      </span>
    </Link>

    <div className="mt-7">
      <h1 className="text-2xl font-semibold tracking-[-0.035em] text-sf-text">
        {title}
      </h1>
      <p className="mt-1.5 text-[13px] leading-5 text-sf-text-muted">
        {description}
      </p>
    </div>
  </header>
);

export default AuthFormHeader;
