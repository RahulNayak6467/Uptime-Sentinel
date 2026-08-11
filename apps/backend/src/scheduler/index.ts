import cron from "node-cron";
import { db } from "../db/index";
import { UrlActiveRowsProps } from "../shared/types/types";
import { addToQueue } from "../queue/monitorQueue";
import logger from "../config/logger";
import createCheckQueue from "../queue/createCheckQueue";
import { addToTlsQueue } from "../queue/tlsQueue";

export const scheduleResponseIntoDB = () => {
  const task = cron.schedule("*/30 * * * * *", async () => {
    const query_url_active =
      "SELECT id,user_id,next_check_at,monitor_type from monitor where is_active = true and next_check_at <= NOW()";
    const getUrlActive = await db.query(query_url_active);
    const getUrlActiveRows: UrlActiveRowsProps[] = getUrlActive.rows;
    console.log(getUrlActiveRows);

    const update_next_check =
      "UPDATE monitor SET next_check_at = NOW() + (interval_seconds || ' seconds')::interval WHERE id = $1";

    for (const monitor of getUrlActiveRows) {
      if (monitor.monitor_type !== 'https') {
        return;
      }
      await db.query(update_next_check, [monitor.id]);
      if (monitor.monitor_type === "http" || monitor.monitor_type === "https") {
          await addToQueue(monitor.user_id, monitor.id);
      }
    }

    // const { id: monitorId, user_id: userId } = getUrlActiveRows[0];

    // logger.info({ monitorId, userId }, "monitor added to the check url queue");
  });

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
};

export const scheduleSlowLaneChecks = () => {
  const task = cron.schedule('*/5 * * * *', async () => {
  const query_tls_active =
      "SELECT id,user_id,next_check_at,monitor_type from monitor where is_active = true and next_check_at <= NOW()";

  const getTlsActive = await db.query(query_tls_active);
    const getTlsActiveRows = getTlsActive.rows;

  const update_next_check =
    "UPDATE monitor SET next_check_at = NOW() + (interval_seconds || ' seconds')::interval WHERE id = $1";

    for (const monitor of getTlsActiveRows) {
      if (monitor.monitor_type === "tls") {
        await db.query(update_next_check, [monitor.id]);
        await addToTlsQueue(monitor.user_id, monitor.id);
      }
    }
  // }
  })

}
