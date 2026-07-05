import LandingPage from "@/features/landing-page/landing-page";

export const metadata = {
  title: "UptimeSentinel — Know when your API fails",
  description:
    "Monitor endpoint uptime and latency, investigate incidents, and get notified when services go down or recover.",
};

export default function Home() {
  return <LandingPage />;
}
