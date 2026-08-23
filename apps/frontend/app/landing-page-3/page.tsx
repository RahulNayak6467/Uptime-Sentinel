import type { Metadata } from "next";
import LandingPageThree from "@/features/landing-page3/landing-page3";

export const metadata: Metadata = {
  title: "StatusForge — The complete reliability operating system",
  description:
    "Monitor APIs and infrastructure globally, investigate incidents, communicate status, and operate production reliability from one workspace.",
};

export default function LandingPageThreeRoute() {
  return <LandingPageThree />;
}
