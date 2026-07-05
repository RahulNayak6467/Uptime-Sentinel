import LoadingScreen from "@/components/ui/loading-screen";

export default function Loading() {
  return (
    <LoadingScreen
      title="Starting UptimeSentinel"
      messages={[
        "Connecting to your workspace…",
        "Preparing monitor status…",
        "Loading the latest checks…",
      ]}
    />
  );
}
