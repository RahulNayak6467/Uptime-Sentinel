import cron, { ScheduledTask } from "node-cron";
import { db } from "../db/index";
import { UrlActiveRowsProps } from "../shared/types/types";
import { addToQueue } from "../queue/monitorQueue";
import logger from "../config/logger";
import { addToTlsQueue } from "../queue/tlsQueue";

export const scheduleFastLaneChecks = () => {
  const task = cron.schedule("*/30 * * * * *", async () => {
    try {
      const query_url_active =
        "SELECT id,user_id,next_check_at,monitor_type from monitor where is_active = true and next_check_at <= NOW() and monitor_type IN ('http', 'https')";
      const getUrlActive = await db.query(query_url_active);
      const getUrlActiveRows: UrlActiveRowsProps[] = getUrlActive.rows;

      const update_next_check =
        "UPDATE monitor SET next_check_at = NOW() + (interval_seconds || ' seconds')::interval WHERE id = $1";

      for (const monitor of getUrlActiveRows) {
        await db.query(update_next_check, [monitor.id]);
        await addToQueue(monitor.user_id, monitor.id);
      }
    } catch (err) {
      logger.error({ err, lane: "fast" }, "Fast-lane scheduler tick failed");
    }
  });

  handleShutdown(task);

};

export const scheduleSlowLaneChecks = () => {
  const task = cron.schedule('*/5 * * * *', async () => {
    try {
      const query_tls_active =
        "SELECT id,user_id,next_check_at,monitor_type from monitor where is_active = true and next_check_at <= NOW() and monitor_type = 'tls'";

      const getTlsActive = await db.query(query_tls_active);
      const getTlsActiveRows: UrlActiveRowsProps[] = getTlsActive.rows;

      const update_next_check =
        "UPDATE monitor SET next_check_at = NOW() + (interval_seconds || ' seconds')::interval WHERE id = $1";

      for (const monitor of getTlsActiveRows) {
        await db.query(update_next_check, [monitor.id]);
        await addToTlsQueue(monitor.user_id, monitor.id);
      }
    } catch (err) {
      logger.error({ err, lane: "slow" }, "Slow-lane scheduler tick failed");
    }
  })

  handleShutdown(task);

}

const handleShutdown = (task:ScheduledTask) => {

  process.on("SIGTERM", () => {
    logger.info("Shutting down scheduler");
    task.stop();
    process.exit(0);
  });

  process.on("SIGINT", () => {
    logger.info("Shutting down scheduler");
    task.stop();
    process.exit(0);
  });
}
