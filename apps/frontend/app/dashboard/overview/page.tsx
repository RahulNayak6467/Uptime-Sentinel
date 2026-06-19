import OverviewHeaders from "@/features/Overview/overview-headers";
import OverviewStats from "@/features/Overview/overview-stats";

const Overview = () => {
  return (
    <section>
      <OverviewHeaders />
      <div>
        <OverviewStats />
      </div>
    </section>
  );
};

export default Overview;
